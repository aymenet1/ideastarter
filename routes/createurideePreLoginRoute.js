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