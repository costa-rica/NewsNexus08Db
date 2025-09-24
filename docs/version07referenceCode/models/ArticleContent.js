const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const ArticleContent = sequelize.define("ArticleContent", {
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ArticleContent;
