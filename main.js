const express = require("express"); 
const session = require("express-session");
const layouts = require("express-ejs-layouts"); 
const mongoose = require("mongoose"); // Ajout de Mongoose
const homeController = require("./controllers/homeController"); 
const errorController = require("./controllers/errorController"); 
const subscriberController = require("./controllers/subscriberController"); 
// Configuration de la connexion à MongoDB 
mongoose.connect( 
  "mongodb://localhost:27017/ai_academy", 
  { useNewUrlParser: true } 
); 
const db = mongoose.connection; 
db.once("open", () => { 
console.log("Connexion réussie à MongoDB en utilisant Mongoose!"); 
}); 
const app = express(); 
// Définir le port 
app.set("port", process.env.PORT || 3000); 
// Configuration d'EJS comme moteur de template 
app.set("view engine", "ejs"); 

app.use(session({
    secret: "secretKeyPourSession",
    resave: false,
    saveUninitialized: true
  }));
  
app.use(layouts); 
// Middleware pour traiter les données des formulaires 
app.use( 
express.urlencoded({ 
extended: false 
}) 
); 
app.use(express.json());// Servir les fichiers statiques 
app.use(express.static("public")); 
app.use((req, res, next) => {
    res.locals.successMessage = req.session.successMessage || null;
    res.locals.errorMessage = req.session.errorMessage || null;
  
    // Réinitialiser les messages après affichage
    req.session.successMessage = null;
    req.session.errorMessage = null;
  
    next();
  });  
// Définir les routes 
app.get("/", homeController.index); 
app.get("/about", homeController.about); 
app.get("/courses", homeController.courses); 
app.get("/contact", homeController.contact); 
app.post("/contact", homeController.processContact); 
app.get("/subscribers", subscriberController.getAllSubscribers); 
app.get("/subscribers/new", subscriberController.getSubscriptionPage); 
app.post("/subscribers/create", subscriberController.saveSubscriber); 
app.get("/subscribers/:id", subscriberController.show); 
app.post("/subscribers/delete/:id", subscriberController.deleteSubscriber);
app.get("/subscribers/edit/:id", subscriberController.editForm);
app.post("/subscribers/update/:id", subscriberController.updateSubscriber);
app.get("/faq", homeController.faq);
app.get("/thanks", (req, res) => {
    res.render("thanks", { pageTitle: "Merci", formData: req.session.formData || {} });
  });
  
// Gestion des erreurs 
app.use(errorController.pageNotFoundError); 
app.use(errorController.internalServerError); 
// Démarrer le serveur 
app.listen(app.get("port"), () => { 
console.log(`Le serveur a démarré et écoute sur le port: ${app.get("port")}`); 
console.log(`Serveur accessible à l'adresse: http://localhost:${app.get("port")}`); 
});