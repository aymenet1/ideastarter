var express = require('express');
var models = require("../models/models.js");
var fs = require("fs");
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

module.exports = (function() {
    'use strict';
    var createurIdeeRoute = express.Router();
    createurIdeeRoute.get("/creer", function(req, res) {
        models.Categorie.findAll().then(function(categories) {
            res.render('createuridee/creer', { categories: categories });
        });
    });

    var cpUpload = upload.fields([{ name: 'image_idee', maxCount: 1 }, { name: 'piece', maxCount: 1 }])

    createurIdeeRoute.post('/creer', cpUpload, function(req, res) {
        var idee = models.Idee.build();
        idee.nom = req.body.nom;
        idee.description = req.body.description;
        idee.date_depot = req.body.date_depot;
        idee.budget = req.body.budget;
        models.Categorie.findById(req.body.categorie).then(function(cat) {
            idee.save().then(function(newIdee) {
                newIdee.setCategorie(cat);
                fs.readFile(req.files.image_idee[0].path, function(err, data) {
                    var newPath = "uploads/idee/" + req.files.image_idee[0].filename;
                    var image = models.Image.build();
                    image.titre = req.body.nom;
                    image.url = newPath;

                    fs.writeFile(newPath, data, function(err) {
                        if (err) throw err;
                    });
                    fs.unlink(req.files.image_idee[0].path, function() {
                        if (err) throw err;
                    });
                    image.save().then(function(img) {
                        newIdee.setImage(img);
                        fs.readFile(req.files.piece[0].path, function(err, data) {
                            var newPath = "uploads/piecejointe/" + req.files.piece[0].filename;
                            var piece = models.Piece.build();
                            piece.titre = req.body.nom;
                            piece.url = newPath;
                            fs.writeFile(newPath, data, function(err) {
                                if (err) throw err;
                            });
                            fs.unlink(req.files.piece[0].path, function() {
                                if (err) throw err;
                            });
                            piece.save().then(function(p) {
                                newIdee.setPiece(p);
                                models.Categorie.findAll().then(function(categories) {
                                    res.render('createuridee/creer', { categories: categories, status: "success" });
                                });
                            });
                        });
                    });
                });
            });
        })
    });

    createurIdeeRoute.get("/mesidees", function(req, res) {
        models.Idee.findAll({
            where: {
                idUtilisateur: 1
            },
            include: [models.Utilisateur, models.Image]
        }).then(function(mesides) {
            console.log(mesides);
            res.render('createuridee/idees', { idUtilisateur: 1, action: "mesides", mesides: mesides });
        });
    });

    createurIdeeRoute.get("/modifier", function(req, res) {
        models.Idee.findAll({
            where: {
                id: 2
            },
            include: [models.Image]
        }).then(function(idees) {
            console.log(idees);
            res.render('createuridee/edit', { id: 1, action: "idees", idees: idees });
        });
    });
    createurIdeeRoute.post('/modifier', function(req, res) {
        models.Idee.findAll({
            where: {
                id: 2
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
    });
    createurIdeeRoute.get("/monidee", function(req, res) {
        models.Idee.findAll({
            where: {
                id: 2
            },
            include: [models.Utilisateur, models.Image]
        }).then(function(monidee) {
            console.log(monidee);
            res.render('createuridee/monidee', { id: 1, action: "monidee", monidee: monidee });
        });
    });
    
    createurIdeeRoute.get("/chercher/categorie/:idCategorie", function(req, res) {
        models.Categorie.findById(req.params.idCategorie).then(function(cat) {
            cat.getIdees({include:[models.Image,models.Utilisateur]}).then(function(idees) {
                models.Categorie.findAll().then(function(categories) {
                    res.render('createuridee/chercher', { categories: categories, categorie: cat, idees: idees });

                });
            });

        });
    });

    
    createurIdeeRoute.post("/chercher", function(req,res){
        if(typeof(req.body.idCategorie)=="undefined"){
            models.Idee.findAll({
                where:{
                    nom: {$like:'%'+req.body.nom+'%'} 
                },
                include:[models.Image,models.Utilisateur]
            }).then(function(idees){
                models.Categorie.findAll().then(function(categories) {
                    res.render('createuridee/chercher', { categories: categories,idees:idees });
                });
            })
        }else{
             models.Idee.findAll({
                where:{
                    nom: {$like:'%'+req.body.nom+'%'},
                    idCategorie:req.body.idCategorie
                },
                include:[models.Image,models.Utilisateur]
            }).then(function(idees){
                models.Categorie.findAll().then(function(categories) {
                    models.Categorie.findById(req.body.idCategorie).then(function(cat) {
                        res.render('createuridee/chercher', { categories: categories,idees:idees, categorie: cat });
                    });
                });
            })
        }
    })

    

    createurIdeeRoute.get("/chercher", function(req, res) {
        models.Categorie.findAll().then(function(categories) {
            res.render('createuridee/chercher', { categories: categories });
        });
    });        

    createurIdeeRoute.post("/enrichir/:idIdee", function(req,res){
        console.log(req.body,req.params.idIdee);
    });

    return createurIdeeRoute;
})();
