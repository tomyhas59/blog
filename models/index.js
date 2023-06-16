const Sequelize = require("sequelize");
const post = require("./post");
const user = require("./user");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config");
const dbconfig = config[env];
const db = {};

const sequelize = new Sequelize(
  dbconfig.database,
  dbconfig.username,
  dbconfig.password,
  dbconfig
);

db.User = user;
db.Post = post;

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
