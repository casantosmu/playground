import { Server } from "#lib/server";
import { loadTest } from "#lib/load-test";
import { models } from "#lib/sequelize";

const stdout = process.stdout;

const handler = async () => {
  return models.Post.findAll({
    attributes: [
      "id",
      "title",
      "content",
      "slug",
      "status",
      "publishedAt",
      "updatedAt",
    ],
    include: [
      {
        model: models.User,
        as: "author",
        attributes: ["id", "username", "firstName", "lastName", "email"],
      },
      {
        model: models.Category,
        as: "categories",
        attributes: ["id", "name", "slug"],
        through: { attributes: [] },
      },
      {
        model: models.Comment,
        as: "comments",
        attributes: ["id", "content", "publishedAt"],
        include: {
          model: models.User,
          as: "author",
          attributes: ["id", "username"],
        },
      },
    ],
    limit: 500,
  });
};

const server = new Server(handler);
const { port, address } = await server.start();

const result = await loadTest({ url: `http://${address}:${port}` });

stdout.write("\n");
stdout.write("Sequelize Eager Loading\n");
stdout.write(result);
stdout.write("\n");

process.exit(0);
