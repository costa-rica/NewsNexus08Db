const { DataTypes } = require("sequelize");
const sequelize = require("./_connection");

const ArticleDuplicateRating = sequelize.define(
	"ArticleDuplicateRating",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},

		// Foreign keys
		articleIdNew: {
			type: DataTypes.INTEGER,
			allowNull: false,
			comment: "Article.id of the NEW article being evaluated",
		},
		articleIdApproved: {
			type: DataTypes.INTEGER,
			allowNull: false,
			comment: "Article.id of the ALREADY-APPROVED article to compare against",
		},

		// Metrics (0–1 scores; nullable until computed)
		urlCheck: {
			type: DataTypes.FLOAT,
			allowNull: true,
			validate: { min: 0, max: 1 },
			comment: "Canonical URL exact/near match score",
		},
		contentHash: {
			type: DataTypes.FLOAT,
			allowNull: true,
			validate: { min: 0, max: 1 },
			comment: "Exact/near-duplicate text hash similarity",
		},
		embeddingSearch: {
			type: DataTypes.FLOAT,
			allowNull: true,
			validate: { min: 0, max: 1 },
			comment: "Cosine similarity of title/body embeddings",
		},
		signatureMatchDate: {
			type: DataTypes.FLOAT,
			allowNull: true,
			validate: { min: 0, max: 1 },
			comment: "Date proximity (e.g., ±3 days)",
		},
		signatureMatchState: {
			type: DataTypes.FLOAT,
			allowNull: true,
			validate: { min: 0, max: 1 },
			comment: "State match score",
		},
		signatureMatchProduct: {
			type: DataTypes.FLOAT,
			allowNull: true,
			validate: { min: 0, max: 1 },
			comment: "Product match score",
		},
		signatureMatchHazard: {
			type: DataTypes.FLOAT,
			allowNull: true,
			validate: { min: 0, max: 1 },
			comment: "Hazard match score",
		},
		signatureMatchPlace: {
			type: DataTypes.FLOAT,
			allowNull: true,
			validate: { min: 0, max: 1 },
			comment: "Place/city/locality overlap",
		},
		signatureMatchPeople: {
			type: DataTypes.FLOAT,
			allowNull: true,
			validate: { min: 0, max: 1 },
			comment: "Named person overlap",
		},
		score: {
			type: DataTypes.FLOAT,
			allowNull: true,
			validate: { min: 0, max: 1 },
			comment: "Score weighted equally",
		},
		scoreWeighted: {
			type: DataTypes.FLOAT,
			allowNull: true,
			validate: { min: 0, max: 1 },
			comment: "Score weighted by custom weightings",
		},
	},
	{
		// This table is rebuilt per run; keep helpful indexes
		indexes: [
			{
				name: "uniq_articleIdNew_articleIdApproved",
				unique: true,
				fields: ["articleIdNew", "articleIdApproved"],
			},
			{ fields: ["articleIdNew"] },
			{ fields: ["articleIdApproved"] },
		],
		// optional: freezeTableName: true, // if you don't want pluralization
	}
);

module.exports = ArticleDuplicateRating;
