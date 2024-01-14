import { Sequelize } from "sequelize";
import initModels from "./sequelize-models/init-models.js";

export const models = initModels(
  new Sequelize(process.env.PG_URI, {
    logging: false,
  })
);
