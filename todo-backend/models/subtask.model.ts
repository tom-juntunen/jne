// src/models/subtask.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';
import { BaseModel, baseModelFields } from './base.model';

export interface SubTaskItemAttributes {
  id?: number;
  title: string;
  description: string;
  completed?: boolean;
  completedAt?: Date | null;
  taskItemId: number; // Parent task id
}

export class SubTaskItem extends BaseModel implements SubTaskItemAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public completed!: boolean;
  public completedAt!: Date | null;
  public taskItemId!: number;
}

SubTaskItem.init({
  ...baseModelFields,
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  taskItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'SubTaskItem',
});
