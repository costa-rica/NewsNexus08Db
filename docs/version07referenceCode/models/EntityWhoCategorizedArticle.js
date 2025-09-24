const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const EntityWhoCategorizedArticle = sequelize.define(
  "EntityWhoCategorizedArticle",
  {
    userId: {
      type: DataTypes.INTEGER,
    },
    artificialIntelligenceId: {
      type: DataTypes.INTEGER,
    },
  }
);

module.exports = EntityWhoCategorizedArticle;
