var models = require("./models.js");
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  var  Image = sequelize.define("Image", {
    id: { type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    url : DataTypes.STRING,
    titre : DataTypes.STRING,
    type : DataTypes.STRING
  });
  return Image;
}