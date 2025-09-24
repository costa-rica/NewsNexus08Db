import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './_connection';

interface ArticleKeywordContractAttributes {
  id: number;
  articleId: number;
  entityWhoCategorizesId: number;
  ranking: number;
}

interface ArticleKeywordContractCreationAttributes extends Optional<ArticleKeywordContractAttributes, 'id'> {}

class ArticleKeywordContract extends Model<ArticleKeywordContractAttributes, ArticleKeywordContractCreationAttributes> implements ArticleKeywordContractAttributes {
  public id!: number;
  public articleId!: number;
  public entityWhoCategorizesId!: number;
  public ranking!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ArticleKeywordContract.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    entityWhoCategorizesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ranking: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ArticleKeywordContract',
    tableName: 'ArticleKeywordContracts',
    timestamps: true,
  }
);

export default ArticleKeywordContract;