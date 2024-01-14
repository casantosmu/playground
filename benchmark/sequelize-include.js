import bodyJson from "#lib/body.json" assert { type: "json" };
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
        attributes: ["id", "email", "username", "firstName", "lastName"],
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
    order: [
      ["id"],
      [{ model: models.Category, as: "categories" }, "id"],
      [{ model: models.Comment, as: "comments" }, "id"],
    ],
  });
};

const server = new Server(handler);
const { port, address } = await server.start();

const expectedBody = JSON.stringify(bodyJson);
const result = await loadTest({
  url: `http://${address}:${port}`,
  verifyBody: (body) => body === expectedBody,
});

stdout.write("\n");
stdout.write("Sequelize Eager Loading\n");
stdout.write(result);
stdout.write("\n");

process.exit(0);
