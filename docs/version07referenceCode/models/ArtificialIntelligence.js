const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const ArtificialIntelligence = sequelize.define("ArtificialIntelligence", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  huggingFaceModelName: {
    type: DataTypes.STRING,
  },
  huggingFaceModelType: {
    type: DataTypes.STRING,
  },
});

module.exports = ArtificialIntelligence;
