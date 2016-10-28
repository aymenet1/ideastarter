var models = require("./models.js");
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var Rating = sequelize.define("Rating", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        note: DataTypes.FLOAT
    });
    return Rating;
}