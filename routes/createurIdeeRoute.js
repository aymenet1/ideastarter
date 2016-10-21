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
          idee.idUtilisateur=1;

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

  //suprimer idée
  createurIdeeRoute.get("/supprimer",function(req,res){
      models.Idee.findAll({where:{
                 idUtilisateur:1},include:[models.Utilisateur, models.Image]}).then(function(mesides){
                 models.Idee.destroy({where:{id:req.query.id}}).then(function(){
                  res.render('createuridee/idees',{idUtilisateur:1, action:"mesides",mesides:mesides}); }); 
                         
  });
   });

  createurIdeeRoute.get("/modifier",function(req,res){
    models.Idee.findAll({where:{id:req.query.id},include:[models.Image]}).then(function(idees){
                  console.log(idees);
    res.render('createuridee/edit',{id:req.query.id, action:"idees",idees:idees});
  });
  });
  //
  createurIdeeRoute.post('/modifier',function (req, res) { 
    console.log(req.body);

    var idee= models.Idee.build();
          idee.nom= req.body.nom;
          idee.description= req.body.description;
          idee.categorie= req.body.categorie;
          idee.date_depot= req.body.date_depot;
          idee.budget= req.body.budget;
         models.idee.updat({
          nom: idee.nom,
          description: idee.description,
          categorie: idee.categorie,
          date_depot: idee.date_depot,
          budget: idee.budget
         },
         {vwhere: {id: 2}
         }).then(function(editIdee){
                  console.log(editIdee);
    //res.render('createuridee/edit'+req.query.id,{id:req.query.id, action:"idees",idees:idees});
      });           
      });


  createurIdeeRoute.get("/monidee",function(req,res){
       models.Idee.findAll({where:{
                 id:req.query.id},include:[models.Utilisateur, models.Image]}).then(function(monidee){
                  console.log(monidee);
        res.render('createuridee/monidee',{id:req.query.id, action:"monidee",monidee:monidee});
      });
     });

  /*createurIdeeRoute.post('/modifier', function(req, res) {
        models.Idee.findAll({
            where: {
                id: 
            },
            include: [models.Utilisateur, models.Image]
        }).then(function(monidee) {
            console.log(monidee);
            monidee.updateAttributes({
                nom: req.body.nom,
                description: req.body.description,
                date_depot: req.body.date_depot,
                budget: req.body.budget
            }).then(function(editIdee) {
                //console.log(editIdee);
                //res.render('createuridee/edit');
                res.render('createuridee/monidee', { id: 1, action: "monidee", monidee: editIdee });

            });
        });
    });*/
          
   return createurIdeeRoute;
})();