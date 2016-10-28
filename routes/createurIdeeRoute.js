var express = require('express');
var models = require("../models/models.js");
var fs = require("fs");
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

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
        if (req.body.categorie == 0) {
            var categorie = models.Categorie.build();
            categorie.nom = req.body.autre_categorie;
            categorie.valide = false;
            categorie.save().then(function(cat) {
                ajouter_idee(cat);
            });
        } else {
            models.Categorie.findById(req.body.categorie).then(function(cat) {
                ajouter_idee(cat);
            });
        }

        function ajouter_idee(cat) {
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
                                    res.render('createuridee/confirmation_idee', { idee: newIdee });
                                });
                            });
                        });
                    });
                });
            });
        }

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
    createurIdeeRoute.get("/idees", function(req, res) {
        models.Idee.findAll({ include: [models.Utilisateur, models.Image] }).then(function(idees) {
            console.log(idees);
            res.render('createuridee/aidees', { action: "idees", idees: idees });
        });
    });
    createurIdeeRoute.get("/idee", function(req, res) {
        models.Idee.findAll({
            where: {
                id: req.query.id
            },
            include: [models.Utilisateur, models.Image, models.Piece, models.Categorie]
        }).then(function(idee) {
            //console.log(idee);
            models.Commentaire.findAll({
                where: {
                    idIdee: req.query.id
                },
                include: [models.Utilisateur]
            }).then(function(comments) {
                models.Commentaire.findAll({
                    where: {
                        idIdee: req.query.id
                    },
                    include: [models.Utilisateur]
                }).then(function(repcoments) {
                    models.RepCommentaire.findAll({
                        where: {
                            idIdee: req.query.id
                        },
                        include: [models.Utilisateur]
                    }).then(function(repcomments) {


                        res.render('createuridee/showidee', { id: req.query.id, action: "idee", idee: idee, comments: comments, repcomments: repcomments });
                    });
                });
            });
        });
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
            where: { id: req.query.id },
            include: [models.Utilisateur,
                models.Image,
                models.Piece,
                models.Categorie
            ]
        }).then(function(monidee) {
            //console.log(monidee);
            models.Commentaire.findAll({
                where: {
                    idIdee: req.query.id
                },
                include: [models.Utilisateur, models.Idee]
            }).then(function(comments) {
                models.RepCommentaire.findAll({
                    where: {
                        idIdee: req.query.id
                    },
                    include: [models.Utilisateur]
                }).then(function(repcomments) {
                    models.Categorie.findAll().then(function(categories) {
                        res.render('createuridee/monidee', { id: req.query.id, action: "monidee", monidee: monidee, categories: categories, comments: comments, repcomments: repcomments });
                    });
                });
            });
        });
    });

    createurIdeeRoute.post('/commentid', function(req, res) {
        var com = models.Commentaire.build();
        com.message = req.body.comment;
        // var idt=req.body.idee;
        var idIdee = req.query.idee;
        // var idee= models.Idee.findAll({where:{id:idIdee}});
        console.log(idIdee);
        com.save().then(function(newcomment) {
            newcomment.setIdee(idIdee);
            newcomment.setUtilisateur(1);
            models.Idee.findAll({
                where: {
                    id: idIdee
                },
                include: [models.Utilisateur,
                    models.Image,
                    models.Piece,
                    models.Categorie
                ]
            }).then(function(idee) {
                models.Commentaire.findAll({
                    where: {
                        idIdee: req.query.idee
                    },
                    include: [models.Utilisateur, models.Idee]
                }).then(function(comments) {
                    models.RepCommentaire.findAll({
                        where: {
                            idIdee: req.query.idee
                        },
                        include: [models.Utilisateur]
                    }).then(function(repcomments) {
                        res.render('createuridee/showidee', { idee: req.query.id, action: "idee", idee: idee, comments: comments, repcomments: repcomments });
                    });
                });
            });
        });
    });

    createurIdeeRoute.post('/repcomment', function(req, res) {
        var com = models.RepCommentaire.build();
        com.message = req.body.comment;
        // var idt=req.body.idee;
        var idIdee = req.query.idee;
        var idc = req.query.idc;
        // var idee= models.Idee.findAll({where:{id:idIdee}});
        console.log(idc);
        com.save().then(function(newcomment) {
            newcomment.setIdee(idIdee);
            newcomment.setUtilisateur(1);
            newcomment.setCommentaire(idc);
            models.Idee.findAll({
                where: {
                    id: idIdee
                },
                include: [models.Utilisateur,
                    models.Image,
                    models.Piece,
                    models.Categorie
                ]
            }).then(function(idee) {
                models.Commentaire.findAll({
                    where: {
                        idIdee: req.query.idee
                    },
                    include: [models.Utilisateur, models.Idee]
                }).then(function(comments) {
                    models.RepCommentaire.findAll({
                        where: {
                            idIdee: req.query.idee
                        },
                        include: [models.Utilisateur, models.Idee]
                    }).then(function(repcomments) {
                        res.render('createuridee/showidee', { idee: req.query.id, action: "idee", idee: idee, comments: comments, repcomments: repcomments });
                    });
                });
            });
        });
    });
    createurIdeeRoute.post('/evaluer/:idIdee',function(req,res){
        console.log(req.body,req.params.idIdee);
        // models.Idee.findById(req.params.idIdee).then(function(idee){
        //     var rating = models.Rating.build();
        //     rating.note = req.body.note;
        //     rating.save().then(function(r){
        //         idee.setRating(r).then(function(data){
        //             console.log(data);
        //         })    
        //     })
        // })
    })
    return createurIdeeRoute;
})();
