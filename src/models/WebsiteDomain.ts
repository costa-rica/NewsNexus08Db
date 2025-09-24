import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './_connection';

interface WebsiteDomainAttributes {
  id: number;
  name: string;
  isArchived: boolean;
  isArchievedNewsDataIo: boolean;
}

interface WebsiteDomainCreationAttributes extends Optional<WebsiteDomainAttributes, 'id' | 'isArchived' | 'isArchievedNewsDataIo'> {}

class WebsiteDomain extends Model<WebsiteDomainAttributes, WebsiteDomainCreationAttributes> implements WebsiteDomainAttributes {
  public id!: number;
  public name!: string;
  public isArchived!: boolean;
  public isArchievedNewsDataIo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WebsiteDomain.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
  },
  {
    sequelize,
    modelName: 'WebsiteDomain',
    tableName: 'WebsiteDomains',
    timestamps: true,
  }
);

export default WebsiteDomain;