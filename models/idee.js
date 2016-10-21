var models = require("./models.js");
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  var  Idee = sequelize.define("Idee", {
    id: { type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    nom : DataTypes.STRING,
    description : DataTypes.TEXT,
    date_depot : DataTypes.DATE,
    budget : DataTypes.FLOAT
  });
  return Idee;
}