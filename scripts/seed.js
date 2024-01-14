import dataset from "#dataset.json" assert { type: "json" };
import { Client } from "#lib/pg";

const client = new Client();
await client.connect();

try {
  await client.transaction(async () => {
    await Promise.all([
      client.bulkInsert({
        tableName: "status",
        columns: {
          status: "TEXT",
        },
        records: dataset.status,
      }),
      client.bulkInsert({
        tableName: "categories",
        columns: {
          category_id: "INT",
          name: "TEXT",
          description: "TEXT",
          slug: "TEXT",
        },
        records: dataset.categories,
      }),
      client.bulkInsert({
        tableName: "users",
        columns: {
          user_id: "INT",
          username: "TEXT",
          password: "TEXT",
          first_name: "TEXT",
          last_name: "TEXT",
          email: "TEXT",
          registered_at: "TIMESTAMPTZ",
        },
        records: dataset.users,
      }),
      client.bulkInsert({
        tableName: "posts",
        columns: {
          post_id: "INT",
          title: "TEXT",
          content: "TEXT",
          slug: "TEXT",
          user_id: "INT",
          status: "TEXT",
          published_at: "TIMESTAMPTZ",
          updated_at: "TIMESTAMPTZ",
        },
        records: dataset.posts,
      }),
      client.bulkInsert({
        tableName: "posts_categories",
        columns: {
          post_id: "INT",
          category_id: "INT",
        },
        records: dataset.postsCategories,
      }),
      client.bulkInsert({
        tableName: "comments",
        columns: {
          comment_id: "INT",
          content: "TEXT",
          user_id: "INT",
          post_id: "INT",
          published_at: "TIMESTAMPTZ",
        },
        records: dataset.comments,
      }),
    ]);
  });

  console.log("Successfully created initial data");
  process.exit(0);
} catch (error) {
  console.error("Error while creating initial data");
  console.error(error);
  process.exit(1);
}
