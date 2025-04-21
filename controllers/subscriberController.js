const Subscriber = require("../models/subscriber"); 
exports.getAllSubscribers = (req, res, next) => {
    const searchQuery = req.query.search;
    let filter = {};
  
    if (searchQuery) {
      if (!isNaN(searchQuery)) {
        // Si c'est un nombre (ex: "11000")
        filter = { zipCode: Number(searchQuery) };
      } else {
        // Sinon, c'est probablement un nom
        const regex = new RegExp(searchQuery, "i");
        filter = { name: regex };
      }
    }
  
    Subscriber.find(filter)
      .exec()
      .then(subscribers => {
        res.render("subscribers/index", {
          pageTitle: "Liste des abonnés",
          subscribers: subscribers
        });
      })
      .catch(error => {
        console.log(`Erreur lors de la récupération des abonnés: ${error.message}`);
        next(error);
      });
  };
   
exports.getSubscriptionPage = (req, res) => { 
    res.render("subscribers/new",{
         pageTitle: "Inscription"});
    }; 
exports.saveSubscriber = (req, res) => { 
    let newSubscriber = new Subscriber({ 
    name: req.body.name, 
    email: req.body.email, 
    zipCode: req.body.zipCode 
    }); 
    newSubscriber.save() 
    .then(result => { 
    res.render("subscribers/thanks",{
        pageTitle: "Merci"}); 
    }) 
    .catch(error => {
      // Vérifie s'il s'agit d'une erreur de validation Mongoose
      if (error.name === "ValidationError") {
        let errorMessages = Object.values(error.errors).map(err => err.message);
        res.status(400).render("subscribers/new", {
          pageTitle: "Inscription",
          errorMessages: errorMessages,
          // Réaffiche les données pour ne pas que l'utilisateur les re-saisisse
          name: req.body.name,
          email: req.body.email,
          zipCode: req.body.zipCode
        });
      } else if (error.code === 11000) { // Email en double
        res.status(400).render("subscribers/new", {
          pageTitle: "Inscription",
          errorMessages: ["Cet email est déjà utilisé."],
          name: req.body.name,
          email: req.body.email,
          zipCode: req.body.zipCode
        });
      } else {
        console.error(error);
        res.status(500).send("Erreur interne du serveur.");
      }
    });
    
}; 
exports.show = (req, res, next) => { 
let subscriberId = req.params.id; 
Subscriber.findById(subscriberId) 
.then(subscriber => { 
res.render("subscribers/show", { 
    pageTitle: "Détails abonné",
    subscriber: subscriber 
}); 
}) 
.catch(error => { 
console.log(`Erreur lors de la récupération d'un abonné par ID: ${error.message}`);
next(error); 
}); 
}; 
exports.deleteSubscriber = (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findByIdAndDelete(subscriberId)
      .then(() => {
        res.redirect("/subscribers");
      })
      .catch(error => {
        console.log(`Erreur lors de la suppression: ${error.message}`);
        next(error);
      });
  };
// Affiche le formulaire de modification
exports.editForm = (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then(subscriber => {
        res.render("subscribers/edit", {
          pageTitle: "Modifier l'abonné",
          subscriber: subscriber
        });
      })
      .catch(error => {
        console.log(`Erreur lors de la récupération de l'abonné pour modification: ${error.message}`);
        next(error);
      });
  };
  
  // Met à jour l'abonné dans la base de données
  exports.updateSubscriber = (req, res, next) => {
    let subscriberId = req.params.id;
    let updatedData = {
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    };
  
    Subscriber.findByIdAndUpdate(subscriberId, updatedData, { new: true })
      .then(() => {
        // Ajouter un message flash
        req.session.successMessage = "Abonné mis à jour avec succès.";
        res.redirect(`/subscribers/${subscriberId}`);
      })
      .catch(error => {
        console.log(`Erreur lors de la mise à jour: ${error.message}`);
        next(error);
      });
  };
  
  