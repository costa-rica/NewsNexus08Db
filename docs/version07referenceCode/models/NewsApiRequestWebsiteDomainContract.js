const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const NewsApiRequestWebsiteDomainContract = sequelize.define(
  "NewsApiRequestWebsiteDomainContract",
  {
    newsApiRequestId: {
      type: DataTypes.INTEGER,
    },
    websiteDomainId: {
      type: DataTypes.INTEGER,
    },
    includedOrExcludedFromRequest: {
      type: DataTypes.STRING,
      defaultValue: "included",
    },
  }
);

module.exports = NewsApiRequestWebsiteDomainContract;
