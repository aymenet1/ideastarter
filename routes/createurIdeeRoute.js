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
  return createurIdeeRoute;
})();