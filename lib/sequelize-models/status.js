import { Model } from "sequelize";

export default class StatusModel extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        status: {
          type: DataTypes.TEXT,
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: "status",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "status_pkey",
            unique: true,
            fields: [{ name: "status" }],
          },
        ],
      }
    );
  }
}
