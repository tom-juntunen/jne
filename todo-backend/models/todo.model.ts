// models/todo.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';
import { BaseModel, baseModelFields } from './base.model';

export interface TodoItemAttributes {
  id?: number;
  title: string;
  description: string;
  completed?: boolean;
  completedAt?: Date | null;
}

export class TodoItem extends BaseModel implements TodoItemAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public completed!: boolean;
  public completedAt!: Date | null;
}

TodoItem.init({
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
}, {
  sequelize,
  modelName: 'TodoItem',
});
