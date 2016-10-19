var express = require('express');
var models = require("../models/models.js");
var fs = require("fs");

module.exports = (function() {
  'use strict';
  var createurIdeeRoute = express.Router(); 
  createurIdeeRoute.get("/creer",function(req,res){
  	res.render('createuridee/creer');
  });
  createurIdeeRoute.post('/creer', function(req, res) {
        var idee= models.Idee.build();
        	console.log(req.body)
          idee.nom= req.body.nom;
          idee.description= req.body.description;
          idee.categorie= req.body.categorie;
          idee.date_depot= req.body.date_depot;
          idee.budget= req.body.budget;
          idee.save().then(function(newIdee){
          	// console.log(newIdee);
          	res.render('createuridee/creer',{status:"success"});
          })
          // fs.readFile(req.files.image.path, function (err, data) {
          //   var newPath = "uploads/idee/"+req.files.image.name;
          //   var image= models.image.build();
          //   image.titre = req.body.nom;
          //   image.url = newPath;

          //   fs.writeFile(newPath, data, function (err) {
          //     if (err) throw err;
          //   });
          //   fs.unlink(req.files.image.path, function() {
          //     if (err) throw err;
          //   });
          //   idee.save().then(function(persisted){
          //   	console.log(persisted);
          //     	image.save().then(function(img){
          //   		idee.setImage(img);
          //   	});
          //       res.render('createuridee/creer',{status:"success"});
          //   });
          // });
          
      });
  return createurIdeeRoute;
})();