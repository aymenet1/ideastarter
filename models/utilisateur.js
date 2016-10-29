var models = require("./models.js");
var Sequelize = require('sequelize');
var bcrypt = require("bcrypt");
module.exports = function(sequelize, DataTypes) {
  var Utilisateur = sequelize.define("Utilisateur", {
    id: { type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    nom : DataTypes.STRING,
    prenom : DataTypes.STRING,
    type : DataTypes.ENUM('createur', 'contributeur','admin'),
    Etat : DataTypes.ENUM('Active', 'En attente','Bloque'),
    email : DataTypes.STRING,
    username : DataTypes.STRING,
    password:DataTypes.STRING,
    entreprise : DataTypes.STRING,
    date_creation : DataTypes.DATE,
    adresse : DataTypes.STRING,
    code_postale : DataTypes.STRING,
    ville : DataTypes.STRING,
    pays : DataTypes.STRING,
    tel : DataTypes.STRING,
    fax : DataTypes.STRING,
    contact : DataTypes.STRING,
    site_web : DataTypes.STRING
  },{
  instanceMethods: {
    setPassword: function(password) {
      var salt = bcrypt.genSaltSync();
      this.password =bcrypt.hashSync(password,salt);
      //console.log("salt "+salt);
      //console.log("password_hash:"+this.password_hash);
    },
    verifyPassword:function(pass) {
      console.log(bcrypt.compareSync(pass,this.password))
      return bcrypt.compareSync(pass,this.password);
    }
    ,
    toJSON: function () {
      console.log(this.get());
      var values = this.get();
      delete values.password;
      delete values.updatedAt;
      delete values.createdAt;
      return values;
    }
  }
})
  return Utilisateur;
}