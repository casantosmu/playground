import { Sequelize } from "sequelize";
import SequelizeAuto from "sequelize-auto";

const auto = new SequelizeAuto(new Sequelize(process.env.PG_URI), null, null, {
  directory: "./lib/sequelize-models",
  caseModel: "c",
  caseProp: "c",
  caseFile: "k",
  singularize: true,
  additional: {
    timestamps: false,
  },
  tables: [
    "comments",
    "posts_categories",
    "posts",
    "categories",
    "users",
    "status",
  ],
  lang: "esm",
});

try {
  await auto.run();
  console.log("SequelizeAuto completed successfully!");
  process.exit(0);
} catch (error) {
  console.error("Error during SequelizeAuto execution");
  console.error(error);
  process.exit(1);
}
