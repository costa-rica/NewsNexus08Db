const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const NewsRssRequest = sequelize.define("NewsRssRequest", {
  newsArticleAggregatorSourceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // requestCount: {
  //   type: DataTypes.STRING,
  //   // allowNull: false,
  // },
  countOfArticlesReceivedFromRequest: {
    type: DataTypes.INTEGER,
  },
  countOfArticlesSavedToDbFromRequest: {
    type: DataTypes.INTEGER,
  },
  dateStartOfRequest: {
    type: DataTypes.DATEONLY,
    // allowNull: false,
  },
  dateEndOfRequest: {
    type: DataTypes.DATEONLY,
    // allowNull: false,
  },
  gotResponse: {
    type: DataTypes.BOOLEAN,
    // allowNull: false,
  },
});

module.exports = NewsRssRequest;
