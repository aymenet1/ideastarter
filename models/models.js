var Sequelize = require('sequelize');

var sequelize = new Sequelize('ideastarter', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port : 3306
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