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
var Commentaire = sequelize.import(__dirname + "/commentaire");
var RepCommentaire = sequelize.import(__dirname + "/Repcommentaire");
var Domain = sequelize.import(__dirname + "/domain");
var Rating = sequelize.import(__dirname + "/rating");
exports.Utilisateur = Utilisateur;
exports.Idee = Idee;
exports.Image = Image;
exports.Piece = Piece;
exports.Categorie = Categorie;
exports.Commentaire = Commentaire;
exports.RepCommentaire = RepCommentaire;
exports.Domain = Domain;
exports.Rating = Rating;
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
Commentaire.belongsTo(Utilisateur, {
        foreignKey: {
            allowNull: true,
            name: 'idUtilisateur'
        }
    });
Commentaire.belongsTo(Idee, {
        foreignKey: {
            allowNull: true,
            name: 'idIdee'
        }
    });
RepCommentaire.belongsTo(Idee, {
        foreignKey: {
            allowNull: true,
            name: 'idIdee'
        }
    });
RepCommentaire.belongsTo(Commentaire, {
        foreignKey: {
            allowNull: true,
            name: 'idCommentaire'
        }
    });
RepCommentaire.belongsTo(Utilisateur, {
        foreignKey: {
            allowNull: true,
            name: 'idUtilisateur'
        }
    });
Domain.hasMany(Utilisateur, {
        foreignKey: {
            allowNull: true,
            name: 'idDomain'
        }
    });
Utilisateur.belongsTo(Domain, {
        foreignKey: {
            allowNull: true,
            name: 'idDomain'
        }
    });
Rating.belongsTo(Idee, {
        foreignKey: {
            allowNull: true,
            name: 'idIdee'
        }
    });
    // idee.setIdee()
    
    Rating.belongsTo(Utilisateur, {
        foreignKey: {
            allowNull: true,
            name: 'idUtilisateur'
        }
    });
    // idee.setUtilisateur()
    sequelize.sync({ force: false });
};
