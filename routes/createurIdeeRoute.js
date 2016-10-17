var express = require('express');
var models = require("../models/models.js");

module.exports = (function() {
  'use strict';
  var createurIdeeRoute = express.Router(); 
  createurIdeeRoute.get("/creer",function(req,res){
  	res.render('createuridee/creer');
  });
  return createurIdeeRoute;
})();