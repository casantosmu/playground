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
        timestamps: false,
      }
    );
  }
}
