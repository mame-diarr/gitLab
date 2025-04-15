const courses = [ 
    { 
    title: "Introduction à l'IA", 
    description: "Découvrez les fondamentaux de l'intelligence artificielle.", 
    price: 199, 
    level: "Débutant" 
    }, 
    { 
    title: "Machine Learning Fondamental", 
    description: "Apprenez les principes du machine learning et les algorithmes de base.", 
    price: 299, 
    level: "Intermédiaire" 
    }, 
    { 
    title: "Deep Learning Avancé", 
    description: "Maîtrisez les réseaux de neurones profonds et leurs applications.", 
    price: 399, 
    level: "Avancé" 
    } 
    ]; 

    exports.index = (req, res) => { 
        res.render("index", { pageTitle: "Accueil" }); 
        }; 
        exports.about = (req, res) => { 
        res.render("about", { pageTitle: "À propos" }); 
        }; 
        exports.courses = (req, res) => {
            const { level, maxPrice } = req.query;
            console.log("Filtrage demandé:", level, maxPrice);
            // Filtrage
            let filteredCourses = courses;
          
            if (level) {
              filteredCourses = filteredCourses.filter(course => course.level === level);
            }
          
            if (maxPrice) {
              const max = parseFloat(maxPrice);
              if (!isNaN(max)) {
                filteredCourses = filteredCourses.filter(course => course.price <= max);
              }
            }
          
            res.render("courses", {
              pageTitle: "Nos Cours",
              courses: filteredCourses
            });
          };          

    exports.contact = (req, res) => {
            res.render("contact", {
              pageTitle: "Contact",
              formData: req.session.formData || {}
            });
          
            // vider les données après affichage
            req.session.formData = null;
          };
          
    exports.processContact = (req, res) => {
                const { name, email, course, message } = req.body;
              
                const errors = [];
              
                // Validation simple
                if (!name || name.trim() === "") {
                  errors.push("Le nom est requis.");
                }
              
                if (!email || email.trim() === "") {
                  errors.push("L'adresse email est requise.");
                } else {
                  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailPattern.test(email)) {
                    errors.push("L'adresse email n'est pas valide.");
                  }
                }
              
                if (errors.length > 0) {
                  // On sauvegarde les données et les erreurs pour les réafficher dans le formulaire
                  req.session.errorMessage = errors.join(" ");
                  req.session.formData = req.body;
                  return res.redirect("/contact");
                }
              
                // Si tout est valide
                req.session.successMessage = "Votre message a bien été envoyé.";
                req.session.formData = req.body;
                res.redirect("/thanks");
              };              
              
    exports.faq = (req, res) => {
            res.render("faq", { pageTitle: "FAQ" });
              };
              