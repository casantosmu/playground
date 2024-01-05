import { faker } from "@faker-js/faker";
import { createClient } from "#db";

const status = ["publish", "future", "draft", "pending", "private"];

const users = Array.from({ length: 8000 }, (_, index) => [
  index + 1,
  faker.internet.userName(),
  faker.internet.password(),
  faker.person.firstName(),
  faker.person.lastName(),
  faker.internet.email(),
  faker.date.past(),
]);

const categories = [
  "Technology",
  "Travel",
  "Cooking",
  "Health and Wellness",
  "Fashion",
  "Sports",
  "Movies and TV",
  "Science",
  "Finance",
  "Art and Culture",
  "Music",
  "Lifestyle",
  "Photography",
  "Animals",
  "News",
  "Home and Garden",
  "Literature",
  "Humor",
  "History",
  "Practical Tips",
].map((name, index) => [
  index + 1,
  name,
  faker.lorem.sentences(),
  faker.helpers.slugify(name).toLowerCase(),
]);

const posts = Array.from({ length: 8000 }, () => faker.lorem.sentence()).map(
  (title, index) => [
    index + 1,
    title,
    faker.lorem.lines(),
    faker.helpers.slugify(title).toLowerCase(),
    faker.number.int({ min: 1, max: users.length }),
    faker.helpers.arrayElement(status),
    faker.helpers.maybe(() => faker.date.past(), { probability: 0.8 }),
    faker.date.past(),
  ]
);

const postsCategories = posts.reduce((prev, post) => {
  const postId = post[0];

  const categoriesIds = new Set(
    faker.helpers.multiple(
      () => faker.number.int({ min: 1, max: categories.length }),
      { count: { min: 0, max: 7 } }
    )
  );

  for (const categoryId of categoriesIds) {
    prev.push([postId, categoryId]);
  }

  return prev;
}, []);

const client = await createClient();

try {
  await client.transaction(async () => {
    await Promise.all([
      client.batchInsert({
        tableName: "status",
        columns: ["status"],
        values: status.map((status) => [status]),
      }),
      client.batchInsert({
        tableName: "categories",
        columns: ["category_id", "category_name", "description", "slug"],
        values: categories,
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
        values: users,
      }),
      client.batchInsert({
        tableName: "posts",
        columns: [
          "post_id",
          "title",
          "content",
          "slug",
          "author_id",
          "status",
          "published_at",
          "updated_at",
        ],
        values: posts,
      }),
      client.batchInsert({
        tableName: "posts_categories",
        columns: ["post_id", "category_id"],
        values: postsCategories,
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
