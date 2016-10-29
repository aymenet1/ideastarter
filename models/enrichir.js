var models = require("./models.js");
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var Enrichir = sequelize.define("Enrichir", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        description: DataTypes.TEXT
    });
    return Categorie;
}
