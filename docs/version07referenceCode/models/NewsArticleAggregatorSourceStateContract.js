const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const NewsArticleAggregatorSourceStateContract = sequelize.define(
  "NewsArticleAggregatorSourceStateContract",
  {
    stateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    newsArticleAggregatorSourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }
);

module.exports = NewsArticleAggregatorSourceStateContract;
