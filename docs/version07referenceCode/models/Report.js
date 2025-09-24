const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const Report = sequelize.define("Report", {
  dateSubmittedToClient: {
    type: DataTypes.DATE,
  },
  nameCrFormat: {
    type: DataTypes.STRING,
  },
  nameZipFile: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Report;
