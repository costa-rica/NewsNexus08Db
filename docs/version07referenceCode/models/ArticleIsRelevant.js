const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const ArticleIsRelevant = sequelize.define("ArticleIsRelevant", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isRelevant: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  kmNotes: {
    type: DataTypes.STRING,
  },
});

module.exports = ArticleIsRelevant;
