const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const ArticleStateContract = sequelize.define("ArticleStateContract", {
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = ArticleStateContract;
