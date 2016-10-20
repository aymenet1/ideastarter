var express = require('express');
var models = require("../models/models.js");
var fs = require("fs");
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

module.exports = (function() {
  'use strict';
  var createurIdeeRoute = express.Router(); 
  createurIdeeRoute.get("/creer",function(req,res){
  	res.render('createuridee/creer');
  });

  var cpUpload = upload.fields([{ name: 'image_idee', maxCount: 1 }, { name: 'piece', maxCount: 1 }])

  createurIdeeRoute.post('/creer',cpUpload, function (req, res) { 
        var idee= models.Idee.build();
          idee.nom= req.body.nom;
          idee.description= req.body.description;
          idee.categorie= req.body.categorie;
          idee.date_depot= req.body.date_depot;
          idee.budget= req.body.budget;

          idee.save().then(function(newIdee){
	          	// console.log(newIdee);
	          	fs.readFile(req.files.image_idee[0].path, function (err, data) {
	            var newPath = "uploads/idee/"+req.files.image_idee[0].filename;
	            var image= models.Image.build();
	            image.titre = req.body.nom;
	            image.url = newPath;

	            fs.writeFile(newPath, data, function (err) {
	              if (err) throw err;
	            });
	            fs.unlink(req.files.image_idee[0].path, function() {
	              if (err) throw err;
	            });
          		image.save().then(function(img){
          			console.log("set image");
            		newIdee.setImage(img);
            	});
          		res.render('createuridee/creer',{status:"success"});
          	});
	    });
    
          
      });
  createurIdeeRoute.get("/mesidees",function(req,res){
       models.Idee.findAll({where:{
                 idUtilisateur:1},include:[models.Utilisateur, models.Image]}).then(function(mesides){
                  console.log(mesides);
        res.render('createuridee/idees',{idUtilisateur:1, action:"mesides",mesides:mesides});
      });
     });

  createurIdeeRoute.get("/modifier",function(req,res){
    models.Idee.findAll({where:{
                 id:2},include:[models.Image]}).then(function(idees){
                  console.log(idees);
    res.render('createuridee/edit',{id:1, action:"idees",idees:idees});
  });
  });
  createurIdeeRoute.post('/modifier', function (req, res) { 
         models.Idee.updateAttributes({
          nom: req.body.nom,
          description: req.body.description,
          categorie: req.body.categorie,
          date_depot: req.body.date_depot,
          budget:req.body.budget
         },
         {
            where: {id : 1 }
         }).then(function(editIdee){
                  //console.log(editIdee);
    //res.render('createuridee/edit');
      });           
      });
  createurIdeeRoute.get("/monidee",function(req,res){
       models.Idee.findAll({where:{
                 id:2},include:[models.Utilisateur, models.Image]}).then(function(monidee){
                  console.log(monidee);
        res.render('createuridee/monidee',{id:1, action:"monidee",monidee:monidee});
      });
     });
      
   return createurIdeeRoute;
})();