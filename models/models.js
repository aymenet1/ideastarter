var Sequelize = require('sequelize');
var config = require("../config.js");

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: 'localhost',
    dialect: 'mysql',
    port: config.port
});

var Utilisateur = sequelize.import(__dirname + "/utilisateur");
var Idee = sequelize.import(__dirname + "/idee");
var Piece = sequelize.import(__dirname + "/piece");
var Image = sequelize.import(__dirname + "/image");
var Categorie = sequelize.import(__dirname + "/categorie");

exports.Utilisateur = Utilisateur;
exports.Idee = Idee;
exports.Image = Image;
exports.Piece = Piece;
exports.Categorie = Categorie;

exports.Sync = function() {
    Idee.belongsTo(Utilisateur, {
        foreignKey: {
            allowNull: true,
            name: 'idUtilisateur'
        }
    });
    //idee.setUtilisateur();
    Idee.belongsTo(Piece, {
        foreignKey: {
            allowNull: true,
            name: 'idPiece'
        }
    });
    //idee.setPiece()

    Idee.belongsTo(Image, {
        foreignKey: {
            allowNull: true,
            name: 'idImage'
        }
    });
    //idee.setImage()
    Categorie.hasMany(Idee, {
        foreignKey: {
            allowNull: true,
            name: 'idCategorie'
        }
    });
    //categorie.getIdees()
    Idee.belongsTo(Categorie, {
        foreignKey: {
            allowNull: true,
            name: 'idCategorie'
        }
    });
    // idee.setCategorie()



    sequelize.sync({ force: false });
};
