var models = require("./models.js");
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  var Utilisateur = sequelize.define("Utilisateur", {
    id: { type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    nom : DataTypes.STRING,
    prenom : DataTypes.STRING,
    type : DataTypes.ENUM('createur', 'contributeur','admin'),
    email : DataTypes.STRING,
    username : DataTypes.STRING,
    password:DataTypes.STRING,
    domaine : DataTypes.STRING,
    entreprise : DataTypes.STRING,
    date_creation : DataTypes.DATE,
    adresse : DataTypes.STRING,
    code_postale : DataTypes.STRING,
    ville : DataTypes.STRING,
    pays : DataTypes.STRING,
    tel : DataTypes.STRING,
    fax : DataTypes.STRING,
    contact : DataTypes.STRING,
    site_web : DataTypes.STRING
  });
  return Utilisateur;
}