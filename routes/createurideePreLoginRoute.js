var express = require('express');
var models = require("../models/models.js");

module.exports = (function() {
  'use strict';
  var createurideePreLogin = express.Router(); 
  createurideePreLogin.get("/idees",function(req,res){
       models.Idee.findAll({include:[models.Utilisateur, models.Image]}).then(function(idees){
                  console.log(idees);
        res.render('idees',{action:"idees",idees:idees});
      });
     });

  createurideePreLogin.get("/inscription",function(req,res){
      
        res.render('inscription');
    
     });
  createurideePreLogin.post('/inscription', function(req, res) {
        var user = models.Utilisateur.build();
        user.nom = req.body.nom;
        user.prenom = req.body.prenom;
        user.type = req.body.selectbasic;
        user.email = req.body.email;
        user.username =req.body.username;
        user.password = req.body.password;
          user.domaine =req.body.domain;
      user.entreprise = req.body.entreprise;
      user.date_creation =req.body.date_creation;
      user.adresse = req.body.adresse;
      user.code_postale =req.body.cp;
      user.ville =req.body.ville;
     user.pays = req.body.pays;
      user.tel = req.body.tel;
      user.fax = req.body.fax;
      user.contact = req.body.contact;
      user.site_web = req.body.site;
            user.save().then(function(newuser) {
         models.Idee.findAll({include:[models.Utilisateur, models.Image]}).then(function(idees){
                  console.log(idees);
        res.render('idees',{action:"idees",idees:idees});
            
              }); });
          });
  createurideePreLogin.get("/idee",function(req,res){
       models.Idee.findAll({where:{id:req.query.id}
       	,include:[models.Utilisateur, 
       			  models.Image,
       			  models.Piece,
       			  models.Categorie]}).then(function(idee){
                  console.log(idee);
        res.render("idee",{id:req.query.id, action:"idee",idee:idee});
      });
     });
  return createurideePreLogin;
})();