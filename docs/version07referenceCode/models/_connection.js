const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(process.env.PATH_DATABASE, process.env.NAME_DB), // Database file location
  logging: false, // Disable logging
});

console.log(
  `database location: ${path.join(
    process.env.PATH_DATABASE,
    process.env.NAME_DB
  )}`
);
module.exports = sequelize;
