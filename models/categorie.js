var models = require("./models.js");
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var Categorie = sequelize.define("Categorie", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        nom: DataTypes.STRING,
        description: DataTypes.TEXT,
        valide: DataTypes.BOOLEAN
    });
    return Categorie;
}
