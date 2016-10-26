var models = require("./models.js");
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var RepCommentaire = sequelize.define("RepCommentaire", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        message: DataTypes.STRING
    });
    return RepCommentaire;
}