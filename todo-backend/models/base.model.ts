// models/base.model.ts
import { Model, DataTypes } from 'sequelize';

export class BaseModel extends Model {
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const baseModelFields = {
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
};
