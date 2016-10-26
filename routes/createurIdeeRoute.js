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


    //supprimer idée
    createurIdeeRoute.get("/supprimer", function(req, res) {
        models.Idee.findAll({
            where: {
                idUtilisateur: 1
            },
            include: [models.Utilisateur, models.Image]
        }).then(function(mesides) {
            models.Idee.destroy({ where: { id: req.query.id } }).then(function() {
                res.render('createuridee/idees', { idUtilisateur: 1, action: "mesides", mesides: mesides });
            });

        });
    });

    createurIdeeRoute.get("/modifier", function(req, res) {
        models.Idee.findAll({ where: { id: req.query.id }, include: [models.Image] }).then(function(idees) {
            console.log(idees);
            res.render('createuridee/edit', { id: req.query.id, action: "idees", idees: idees });
        });
    });
    //////////////////////////////////////////////////////////////////
    createurIdeeRoute.post('/modifier', cpUpload, function(req, res) {

        var idee = models.Idee.build();
        idee.nom = req.body.nom;
        idee.description = req.body.description;
        idee.categorie = req.body.categorie;
        idee.date_depot = req.body.date_depot;
        idee.budget = req.body.budget;
        idee.idUtilisateur = 1;
        idee.id = req.body.id;
        idee.img = req.body.image_id;
        console.log(idee.nom);
        console.log(idee.img);
        models.Idee.update({
            nom: idee.nom,
            description: idee.description,
            date_depot: idee.date_depot,
            budget: idee.budget
        }, { where: { id: idee.id } }).then(function(editIdee) {
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
                models.Image.update({
                    titre: image.titre,
                    url: image.url
                }, { where: { id: idee.img } }).then(function(updatimg) {
                    models.Idee.findAll({
                        where: {
                            id: idee.id
                        },
                        include: [models.Utilisateur, models.Image]
                    }).then(function(monidee) {
                        console.log(updatimg);
                        res.render('createuridee/monidee', { id: idee.id, action: "monidee", monidee: monidee });
                    });
                });
            });
        });
    });
    createurIdeeRoute.get("/chercher/categorie/:idCategorie", function(req, res) {
        models.Categorie.findById(req.params.idCategorie).then(function(cat) {
            cat.getIdees({ include: [models.Image, models.Utilisateur] }).then(function(idees) {
                models.Categorie.findAll().then(function(categories) {
                    res.render('createuridee/chercher', { categories: categories, categorie: cat, idees: idees });

                });
            });

        });
    });
    createurIdeeRoute.get("/chercher", function(req, res) {
        models.Categorie.findAll().then(function(categories) {
            res.render('createuridee/chercher', { categories: categories });
        });
    });
    createurIdeeRoute.get("/monidee", function(req, res) {
        models.Idee.findAll({
            where: {
                id: req.query.id
            },
            include: [models.Utilisateur, models.Image, models.Piece, models.Categorie]
        }).then(function(monidee) {
            console.log(monidee);
            res.render('createuridee/monidee', { id: req.query.id, action: "monidee", monidee: monidee });
        });
    });

    return createurIdeeRoute;
})();
