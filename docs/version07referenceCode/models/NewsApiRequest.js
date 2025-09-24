const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const NewsApiRequest = sequelize.define("NewsApiRequest", {
  newsArticleAggregatorSourceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  countOfArticlesReceivedFromRequest: {
    type: DataTypes.INTEGER,
  },
  countOfArticlesSavedToDbFromRequest: {
    type: DataTypes.INTEGER,
  },
  countOfArticlesAvailableFromRequest: {
    type: DataTypes.INTEGER,
  },
  dateStartOfRequest: {
    type: DataTypes.DATEONLY,
  },
  dateEndOfRequest: {
    type: DataTypes.DATEONLY,
  },
  status: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
  },
  andString: {
    type: DataTypes.STRING,
  },
  orString: {
    type: DataTypes.STRING,
  },
  notString: {
    type: DataTypes.STRING,
  },
  isFromAutomation: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = NewsApiRequest;
