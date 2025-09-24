const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const EntityWhoFoundArticle = sequelize.define("EntityWhoFoundArticle", {
  userId: {
    type: DataTypes.INTEGER,
  },
  newsArticleAggregatorSourceId: {
    type: DataTypes.INTEGER,
  },
});

module.exports = EntityWhoFoundArticle;
