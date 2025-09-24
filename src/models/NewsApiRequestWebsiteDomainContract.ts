import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './_connection';

interface NewsApiRequestWebsiteDomainContractAttributes {
  id: number;
  newsApiRequestId: number | null;
  websiteDomainId: number | null;
  includedOrExcludedFromRequest: string;
}

interface NewsApiRequestWebsiteDomainContractCreationAttributes extends Optional<NewsApiRequestWebsiteDomainContractAttributes, 'id' | 'newsApiRequestId' | 'websiteDomainId' | 'includedOrExcludedFromRequest'> {}

class NewsApiRequestWebsiteDomainContract extends Model<NewsApiRequestWebsiteDomainContractAttributes, NewsApiRequestWebsiteDomainContractCreationAttributes> implements NewsApiRequestWebsiteDomainContractAttributes {
  public id!: number;
  public newsApiRequestId!: number | null;
  public websiteDomainId!: number | null;
  public includedOrExcludedFromRequest!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

NewsApiRequestWebsiteDomainContract.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
  },
  {
    sequelize,
    modelName: 'NewsApiRequestWebsiteDomainContract',
    tableName: 'NewsApiRequestWebsiteDomainContracts',
    timestamps: true,
  }
);

export default NewsApiRequestWebsiteDomainContract;