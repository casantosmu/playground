import { Model } from "sequelize";

export default class CategoryModel extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          autoIncrementIdentity: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          field: "category_id",
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        slug: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "categories",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "categories_pkey",
            unique: true,
            fields: [{ name: "category_id" }],
          },
        ],
      }
    );
  }
}
