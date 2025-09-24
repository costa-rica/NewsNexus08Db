import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './_connection';

interface ArticleReviewedAttributes {
  id: number;
  userId: number;
  articleId: number;
  isReviewed: boolean;
  kmNotes: string | null;
}

interface ArticleReviewedCreationAttributes extends Optional<ArticleReviewedAttributes, 'id' | 'isReviewed' | 'kmNotes'> {}

class ArticleReviewed extends Model<ArticleReviewedAttributes, ArticleReviewedCreationAttributes> implements ArticleReviewedAttributes {
  public id!: number;
  public userId!: number;
  public articleId!: number;
  public isReviewed!: boolean;
  public kmNotes!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ArticleReviewed.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isReviewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    kmNotes: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'ArticleReviewed',
    tableName: 'ArticleRevieweds',
    timestamps: true,
  }
);

export default ArticleReviewed;