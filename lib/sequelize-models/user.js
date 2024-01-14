import { Model, Sequelize } from "sequelize";

export default class UserModel extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          autoIncrementIdentity: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          field: "user_id",
        },
        username: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        password: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        firstName: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "first_name",
        },
        lastName: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "last_name",
        },
        email: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        registeredAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
          field: "registered_at",
        },
      },
      {
        sequelize,
        tableName: "users",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "users_pkey",
            unique: true,
            fields: [{ name: "user_id" }],
          },
        ],
      }
    );
  }
}
