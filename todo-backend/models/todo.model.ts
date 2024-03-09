// models/todo.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../database';

export interface TodoItemAttributes {
  id?: number;
  title: string;
  description: string;
  completed?: boolean;
}

export class TodoItem extends Model<TodoItemAttributes> implements TodoItemAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public completed!: boolean;
}

TodoItem.init({
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
}, {
  sequelize,
  modelName: 'TodoItem',
});
