import { createClient } from "#db";
import dataset from "#dataset.json" assert { type: "json" };

const client = await createClient();

try {
  await client.transaction(async () => {
    await Promise.all([
      client.batchInsert({
        tableName: "status",
        columns: ["status"],
        values: dataset.status.map((status) => [status]),
      }),
      client.batchInsert({
        tableName: "categories",
        columns: ["category_id", "name", "description", "slug"],
        values: dataset.categories,
      }),
      client.batchInsert({
        tableName: "users",
        columns: [
          "user_id",
          "username",
          "password",
          "first_name",
          "last_name",
          "email",
          "registered_at",
        ],
        values: dataset.users,
      }),
      client.batchInsert({
        tableName: "posts",
        columns: [
          "post_id",
          "title",
          "content",
          "slug",
          "user_id",
          "status",
          "published_at",
          "updated_at",
        ],
        values: dataset.posts,
      }),
      client.batchInsert({
        tableName: "posts_categories",
        columns: ["post_id", "category_id"],
        values: dataset.postsCategories,
      }),
      client.batchInsert({
        tableName: "comments",
        columns: [
          "comment_id",
          "content",
          "user_id",
          "post_id",
          "published_at",
        ],
        values: dataset.comments,
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
