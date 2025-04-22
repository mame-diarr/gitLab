const User = require("../models/user");
const passport = require("passport");

module.exports = {
  // Affiche le formulaire de connexion
  login: (req, res) => {
    res.render("auth/login", {pageTitle: "Connexion"});
  },

  // Gère l'authentification des utilisateurs
  authenticate: passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Votre email ou mot de passe est incorrect.",
    successRedirect: "/",
    successFlash: "Vous êtes maintenant connecté!"
  }),

  // Déconnecte l'utilisateur
  logout: (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash("success", "Vous avez été déconnecté avec succès!");
      res.redirect("/");
    });
  },

  // Affiche le formulaire d'inscription
  signup: (req, res) => {
    res.render("auth/signup", {pageTitle: "Inscription"});
  },

  // Crée un nouvel utilisateur et l'authentifie
  register: (req, res, next) => {
    if (req.skip) return next();

    let newUser = new User({
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      zipCode: req.body.zipCode
    });

    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        req.flash("success", `Le compte de ${user.fullName} a été créé avec succès!`);
        res.redirect("/");
      } else {
        req.flash("error", `Échec de la création du compte utilisateur: ${error.message}`);
        res.redirect("/signup");
      }
    });
  },

  // Middleware pour vérifier si l'utilisateur est connecté
  ensureLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error", "Vous devez être connecté pour accéder à cette page.");
      res.redirect("/login");
    }
  }
};
