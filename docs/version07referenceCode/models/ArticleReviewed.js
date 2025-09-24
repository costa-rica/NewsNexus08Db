const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const ArticleReviewed = sequelize.define("ArticleReviewed", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isReviewed: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  kmNotes: {
    type: DataTypes.STRING,
  },
});

module.exports = ArticleReviewed;
