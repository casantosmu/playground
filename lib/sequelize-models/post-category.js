import { Model } from "sequelize";

export default class PostCategoryModel extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: "posts",
            key: "post_id",
          },
          field: "post_id",
        },
        categoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: "categories",
            key: "category_id",
          },
          field: "category_id",
        },
      },
      {
        sequelize,
        tableName: "posts_categories",
        timestamps: false,
      }
    );
  }
}
