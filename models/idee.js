var models = require("./models.js");
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  var  Idee = sequelize.define("Idee", {
    id: { type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    nom : DataTypes.STRING,
    description : DataTypes.TEXT,
    categorie : DataTypes.STRING,
    date_depot : DataTypes.DATE
  });
  return Idee;
}