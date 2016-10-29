var express = require('express');
var models = require("../models/models.js");
var crypto = require('crypto');
module.exports = (function() {
  'use strict';
  var PreLogin = express.Router(); 

  PreLogin.get("/login",function(req,res){
              res.render('login');
     });

PreLogin.post('/login', function(req, res) {
        if (req.body.email!=null&&req.body.password!=null) {
            models.Utilisateur.findOne({where:{ email: req.body.email}}).then(function(Utilisateur){
            if(Utilisateur!=null){
                if(Utilisateur.verifyPassword(req.body.password)==true){
                        req.session.loggedIn = true;
                        req.session.Utilisateur = Utilisateur.toJSON();
                      console.log(Utilisateur.type);
                  if(Utilisateur.type=='createur'){
                        res.redirect('createuridee/mesidees');
                    }else if(Utilisateur.type=='contributeur'){
                        res.redirect('createuridee/idees');
                    }else if(Utilisateur.type=='contributeur') {
                   res.redirect('admin/admin');
                }
                }
              }
            });
        }else{
            res.send(JSON.stringify({"status":"failure","cause":"no parameters"}));
        }
    });
  PreLogin.get("/inscription",function(req,res){
       models.Domain.findAll().then(function(domains){
        res.render('inscription',{action:"domains",domains:domains});
    
     });});
  PreLogin.post('/inscription', function(req, res) {
        var user = models.Utilisateur.build();
        var domain = models.Domain.build();
        user.nom = req.body.nom;
        user.prenom = req.body.prenom;
        user.type = req.body.selectbasic;
        user.email = req.body.email;
        user.username =req.body.username;
        user.setPassword(req.body.password);
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
       if (req.body.domain == 'Autre') {
            var domain = models.Domain.build();
            domain.nom = req.body.autre;
            domain.valide = false;
            domain.save().then(function(dom) {
                ajouter_user(dom);
            });
        } else {
            models.Domain.findById(req.body.domain).then(function(dom) {
                ajouter_user(dom);
            });
        }
        function ajouter_user(dom) {
            user.save().then(function(newuser) {
              console.log(dom);
              newuser.setDomain(dom);
         models.Idee.findAll({include:[models.Utilisateur, models.Image]}).then(function(idees){
                  console.log(idees);
        res.render('idees',{action:"idees",idees:idees});
            
              }); });
          }
          });
  
     return PreLogin;
})();