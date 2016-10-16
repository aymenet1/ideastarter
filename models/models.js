var Sequelize = require('sequelize');

var sequelize = new Sequelize('ideastarter', 'root', 'qqdwmkf2', {
  host: 'localhost',
  dialect: 'mysql',
  port : 8889
});
var Utilisateur = sequelize.import(__dirname + "/utilisateur");
var Idee = sequelize.import(__dirname + "/idee");
var Piece = sequelize.import(__dirname + "/Piece");

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
	sequelize.sync({force: true});
};