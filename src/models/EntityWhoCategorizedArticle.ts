import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './_connection';

interface EntityWhoCategorizedArticleAttributes {
  id: number;
  userId: number | null;
  artificialIntelligenceId: number | null;
}

interface EntityWhoCategorizedArticleCreationAttributes extends Optional<EntityWhoCategorizedArticleAttributes, 'id' | 'userId' | 'artificialIntelligenceId'> {}

class EntityWhoCategorizedArticle extends Model<EntityWhoCategorizedArticleAttributes, EntityWhoCategorizedArticleCreationAttributes> implements EntityWhoCategorizedArticleAttributes {
  public id!: number;
  public userId!: number | null;
  public artificialIntelligenceId!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EntityWhoCategorizedArticle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    artificialIntelligenceId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'EntityWhoCategorizedArticle',
    tableName: 'EntityWhoCategorizedArticles',
    timestamps: true,
  }
);

export default EntityWhoCategorizedArticle;