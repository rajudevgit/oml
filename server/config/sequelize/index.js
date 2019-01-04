var fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  config = require('../../config/config'),
  db = {};

//var sequelize = new Sequelize(config.db);

var sequelize = new Sequelize(config.mysql.dbName, config.mysql.dbUser, config.mysql.dbPass, {
    host: config.mysql.dbHost,
    dialect: 'mysql',
    port: 3306,
    pool: {
        maxConnections: 10
    },
    logging: config.logging,
});

fs.readdirSync(__dirname).filter(function (file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function (file) {
  var model = sequelize['import'](path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
