import { Model, Sequelize } from "sequelize";

export default class PostModel extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          autoIncrementIdentity: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          field: "post_id",
        },
        title: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        slug: {
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
        status: {
          type: DataTypes.TEXT,
          allowNull: false,
          references: {
            model: "status",
            key: "status",
          },
        },
        publishedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "published_at",
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "updated_at",
        },
      },
      {
        sequelize,
        tableName: "posts",
        timestamps: false,
      }
    );
  }
}
