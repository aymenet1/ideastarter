var Sequelize = require('sequelize');
var config = require("../config.js");

var sequelize = new Sequelize(config.database, config.username, config.password, {
  host: 'localhost',
  dialect: 'mysql',
  port : config.port
});

var Utilisateur = sequelize.import(__dirname + "/utilisateur");
var Idee = sequelize.import(__dirname + "/idee");
var Piece = sequelize.import(__dirname + "/piece");
var Image = sequelize.import(__dirname + "/image");

exports.Utilisateur = Utilisateur;
exports.Idee = Idee;
exports.Image = Image;
exports.Piece = Piece;

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
	sequelize.sync({force: true});
};