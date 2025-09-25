import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './_connection';

interface ArticleDuplicateRatingAttributes {
  id: number;
  articleIdNew: number;
  articleIdApproved: number;
  urlCheck: number | null;
  contentHash: number | null;
  embeddingSearch: number | null;
  signatureMatchDate: number | null;
  signatureMatchState: number | null;
  signatureMatchProduct: number | null;
  signatureMatchHazard: number | null;
  signatureMatchPlace: number | null;
  signatureMatchPeople: number | null;
  score: number | null;
  scoreWeighted: number | null;
}

interface ArticleDuplicateRatingCreationAttributes extends Optional<ArticleDuplicateRatingAttributes, 'id' | 'urlCheck' | 'contentHash' | 'embeddingSearch' | 'signatureMatchDate' | 'signatureMatchState' | 'signatureMatchProduct' | 'signatureMatchHazard' | 'signatureMatchPlace' | 'signatureMatchPeople' | 'score' | 'scoreWeighted'> {}

export class ArticleDuplicateRating extends Model<ArticleDuplicateRatingAttributes, ArticleDuplicateRatingCreationAttributes> implements ArticleDuplicateRatingAttributes {
  public id!: number;
  public articleIdNew!: number;
  public articleIdApproved!: number;
  public urlCheck!: number | null;
  public contentHash!: number | null;
  public embeddingSearch!: number | null;
  public signatureMatchDate!: number | null;
  public signatureMatchState!: number | null;
  public signatureMatchProduct!: number | null;
  public signatureMatchHazard!: number | null;
  public signatureMatchPlace!: number | null;
  public signatureMatchPeople!: number | null;
  public score!: number | null;
  public scoreWeighted!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initArticleDuplicateRating() {
  ArticleDuplicateRating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
    sequelize,
    modelName: 'ArticleDuplicateRating',
    tableName: 'ArticleDuplicateRatings',
    timestamps: true,
    indexes: [
      {
        name: "uniq_articleIdNew_articleIdApproved",
        unique: true,
        fields: ["articleIdNew", "articleIdApproved"],
      },
      { fields: ["articleIdNew"] },
      { fields: ["articleIdApproved"] },
    ],
  }
  );
  return ArticleDuplicateRating;
}

export default ArticleDuplicateRating;