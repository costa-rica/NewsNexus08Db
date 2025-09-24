const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const ArticleApproved = sequelize.define("ArticleApproved", {
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	articleId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	isApproved: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},
	headlineForPdfReport: {
		type: DataTypes.STRING,
	},
	publicationNameForPdfReport: {
		type: DataTypes.STRING,
	},
	publicationDateForPdfReport: {
		type: DataTypes.DATEONLY,
	},
	textForPdfReport: {
		type: DataTypes.STRING,
	},
	urlForPdfReport: {
		type: DataTypes.STRING,
	},
	kmNotes: {
		type: DataTypes.STRING,
	},
});

module.exports = ArticleApproved;
