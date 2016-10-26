var models = require("./models.js");
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var Domain = sequelize.define("Domain", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        nom: DataTypes.STRING,
        valide: DataTypes.BOOLEAN
    });
    return Domain;
}