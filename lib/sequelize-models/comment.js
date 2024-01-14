import { Model, Sequelize } from "sequelize";

export default class CommentModel extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          autoIncrementIdentity: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          field: "comment_id",
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "user_id",
          },
          field: "user_id",
        },
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "posts",
            key: "post_id",
          },
          field: "post_id",
        },
        publishedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "published_at",
        },
      },
      {
        sequelize,
        tableName: "comments",
        timestamps: false,
      }
    );
  }
}
