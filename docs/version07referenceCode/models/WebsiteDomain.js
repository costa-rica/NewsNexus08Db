const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const WebsiteDomain = sequelize.define("WebsiteDomain", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isArchievedNewsDataIo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = WebsiteDomain;
