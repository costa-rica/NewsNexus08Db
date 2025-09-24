const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const NewsArticleAggregatorSource = sequelize.define(
  "NewsArticleAggregatorSource",
  {
    nameOfOrg: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
    apiKey: {
      type: DataTypes.STRING,
    },
    isApi: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isRss: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }
);

module.exports = NewsArticleAggregatorSource;
