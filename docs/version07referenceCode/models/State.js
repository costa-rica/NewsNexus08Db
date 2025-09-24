const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const State = sequelize.define("State", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  abbreviation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = State;
