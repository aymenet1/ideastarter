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
exports.Sync = function() {  
	Idee.belongsTo(Utilisateur, { 
	  foreignKey: { 
	    allowNull: true, 
	    name: 'idUtilisateur'
	  }
	});
	Piece.belongsTo(Idee, { 
	  foreignKey: { 
	    allowNull: true, 
	    name: 'idIdee'
	  }
	});
	Image.belongsTo(Idee, { 
	  foreignKey: { 
	    allowNull: true, 
	    name: 'idIdee'
	  }
	});
	sequelize.sync({force: true});
};