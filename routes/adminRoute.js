var express = require('express');
var models = require("../models/models.js");
var crypto = require('crypto');
module.exports = (function() {
  'use strict';
  var admin = express.Router(); 

  //////////////////////////////////////////////////////////////////
     admin.get("/admin",function(req,res){
       models.Utilisateur.findAll({include:[models.Domain]}).then(function(Utilisateurs){
              res.render('admin/dashboard',{action:"utilisateur",Utilisateurs:Utilisateurs});
     });});

     admin.get("/user",function(req,res){
       models.Utilisateur.findOne({where:{
                 id:req.query.id},include:[models.Domain]}).then(function(Utilisateurs){
          models.Idee.findAll({where:{
                 idUtilisateur:req.query.id},include:[models.Categorie]}).then(function(idees){
                           res.render('admin/user',{action:"utilisateur",Utilisateurs:Utilisateurs,idees,idees});
     });});});

          admin.get("/deletuser",function(req,res){
      models.Utilisateur.findAll({include:[models.Domain]}).then(function(Utilisateurs){
                 models.Utilisateur.destroy({where:{id:req.query.id}}).then(function(){
                  res.render('admin/dashboard',{action:"Utilisateurs",Utilisateurs:Utilisateurs}); }); 
                         
  });
   });
           admin.get("/updateuser",function(req,res){
                  models.Utilisateur.update({
                Etat: req.query.etat},{where: {id:req.query.id }}).then(function(edituser) {
              models.Utilisateur.findAll({include:[models.Domain]}).then(function(Utilisateurs){
                    res.render('admin/dashboard',{action:"Utilisateurs",Utilisateurs:Utilisateurs}); 
                  }); 
                         
     });
   });
       
     return admin;
})();