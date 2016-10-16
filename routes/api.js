var express = require('express');
var models = require("../models/models.js");
var multer = require("multer");
var upload = multer({ dest: './uploads' });
var fs = require("fs");
var Sequelize = require('sequelize');
var _ = require('lodash');
module.exports = (function() {
    'use strict';
    var api = express.Router();
    api.post('/addArticle', function(req, res) {
        console.log(req.body.article);
        var article = models.Article.build(req.body.article);
        article.save().then(function(newArticle) {
            res.status(200).json(newArticle);
        });
    });
    api.post('/addCategory', function(req, res) {
        var category = models.Category.build(req.body);
        category.save().then(function(newCategory) {
            // res.status(200).json(newCategory);
            listCategories(req, res);
        });
    });
    api.post('/addSubcategory/:categoryId', function(req, res) {
        var subcategory = models.Subcategory.build(req.body);
        subcategory.save().then(function(newSubcategory) {
            models.Category.findOne({ where: { categoryId: req.params.categoryId } }).then(function(cat) {
                cat.addSubcategory(newSubcategory).then(function() {
                    listSubcategories(req, res);
                });
            });
        });
    });
    api.get('/listSubcategories/:categoryId', function(req, res) {
        console.log("categoryId ", req.params.categoryId);
        listSubcategories(req, res);
    });

    function listSubcategories(req, res) {
        models.Subcategory.findAll({
            where: { categoryId: req.params.categoryId },
            // raw: true,
        }).then(function(subcategory) {
            console.log(subcategory);
            res.status(200).json(subcategory);
        }).error(function(err) {
            console.log(err);
            res.status(422).json(err);
        });
    }
    api.get('/listCategories', function(req, res) {
        listCategories(req, res);
    });

    function listCategories(req, res) {
        models.Category.findAll({
            include: [models.Subcategory],
            // raw: true
        }).then(function(categories) {
            console.log(categories);
            res.status(200).json(categories);
        }).error(function(err) {
            console.log(err);
            res.status(422).json(err);
        });
    }
    // userRoute.post('/addTrip',upload.single('photo'),function(req,res,next){
    //   var trip = models.Trip.build(req.body);
    //   trip.active = true;
    //   trip.photoUrl = "uploads/trips/"+uuid.v4()+".jpeg";
    //   // console.log("add trip decoded ",req.decoded);
    //   models.Organisation.findOne({where: {organisationId:req.decoded.organisation.organisationId}}).then(function(org){
    //     trip.save().then(function(newTrip){
    //       org.addTrip(newTrip).then(function(t){
    //         console.log(newTrip.get({plain: true}));
    //         fs.readFile(req.file.path, function (err, data) {
    //         fs.writeFile(newTrip.photoUrl, data, function (err) {
    //             if (err) throw err;
    //           });
    //           fs.unlink(req.file.path, function() {
    //             if (err) throw err;
    //           });
    //           res.json(newTrip.get({plain: true}));
    //         });
    //       });
    //     });
    //   });
    // });

    // api.post('/addUsers', function(req, res) {
    //     // console.log("req body",req.body);
    //     var users = req.body.usersToRegister;
    //     var admin = req.body.admin;
    //     var savedUsers = [];
    //     models.Admin.findOne({where:{ email: admin.email }}).then(function(admin){
    //         // console.log(admin);
    //         models.User.findAll({raw:true}).then(function(storedUsers){
    //             var usersToSave = _.differenceBy(users,storedUsers, 'email');
    //             if (usersToSave.length>0) {
    //                 addUsers(usersToSave,admin,0,savedUsers,req,res);
    //             }else{
    //                 res.status(422).json({"status" : "failure","msg":"no users to save"});
    //             }  
    //         }).catch(function(err) {
    //             console.log(err);
    //         });
    //     });
    // });
    // function addUsers(listUsers,admin,index,savedUsers,req,res){
    //     if(index<listUsers.length){
    //         var user = models.User.build(listUsers[index]);
    //         user.save().then(function(u){
    //             // console.log("saved user",u.toJSON(),"index",index);
    //             savedUsers.push(u);
    //             index ++;
    //             addUsers(listUsers,admin,index,savedUsers,req,res);
    //         }).catch(Sequelize.ValidationError, function (err) {
    //             index ++;
    //             addUsers(listUsers,admin,index,savedUsers,req,res);
    //         })
    //         .catch(function (err) {
    //             index ++;
    //             addUsers(listUsers,admin,index,savedUsers,req,res);
    //         });  
    //     }else{
    //         if (savedUsers.length>0) {
    //             admin.addUsers(savedUsers).then(function(o){
    //                 console.log(savedUsers);
    //                 res.status(200).json({"status":"success" ,"savedUsers" : savedUsers});
    //             })
    //         }else{
    //             res.status(200).json({"status":"success","savedUsers" : savedUsers});
    //         }
    //     }

    // }
    // api.get('/users', function (req, res,next) {
    //     models.User.findAll({raw:true,attributes:['email']}).then(function(users){
    //         res.status(200).json(users);
    //     }).catch(function(err) {
    //         console.log(err);
    //         res.status(422).json(err);
    //     });
    // });

    // function addAdmin(req, res){
    //     var adminBody = req.body;
    //     console.log(req.body);
    //     var admin = models.Admin.build();
    //     admin.setPassword(adminBody.password);
    //     admin.firstname = adminBody.firstname;
    //     admin.lastname = adminBody.lastname;
    //     admin.email = adminBody.email;
    //     admin.save().then(function(a){
    //         res.json(a);
    //     }).error(function(error){
    //     console.log(error);
    //     res.send(JSON.stringify({"status":"failure","cause":"error"}));
    //   });
    // }
    // api.post('/admin/new', function(req, res) {
    //     addAdmin(req,res);
    // });
    // api.post('/admin/auth', function(req, res) {
    //     if (req.body.email!=null&&req.body.password!=null) {
    //         models.Admin.findOne({where:{ email: req.body.email }}).then(function(admin){
    //         if(admin!=null){
    //             console.log("verification of password ",admin.verifyPassword(req.body.password));
    //             if(admin.verifyPassword(req.body.password)){
    //                 res.json({status:"success",admin : admin.toJSON()});
    //             }else{
    //                 res.status(422).json({status:"failure",cause:"bad password"});
    //             }
    //         }else{
    //             res.status(422).json({status:"failure",cause:"bad login or password"});
    //         }
    //     });
    //     }else{
    //         res.status(422).json({status:"failure",cause:"no parameters"});
    //     }
    // });
    // api.post('/admin/verifyEmail', function(req, res) {
    //     if (req.body.email) {
    //         models.Admin.findOne({where:{ email: req.body.email }}).then(function(admin){
    //         if(admin!=null){
    //             res.json({status:"success"});
    //         }else{
    //             res.status(422).json({status:"failure",msg:"email inexistant"});
    //         }
    //     });
    //     }else{
    //         res.status(422).json({status:"failure",msg:"no parameters"});
    //     }
    // });
    return api;
})();
