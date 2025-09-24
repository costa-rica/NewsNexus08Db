const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const ArticleKeywordContract = sequelize.define("ArticleKeywordContract", {
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  entityWhoCategorizesId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // keywordId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  // },
  ranking: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = ArticleKeywordContract;
