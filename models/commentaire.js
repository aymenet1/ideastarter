var models = require("./models.js");
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var Commentaire = sequelize.define("Commentaire", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        message: DataTypes.STRING
    });
    return Commentaire;
}