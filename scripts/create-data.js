import { faker } from "@faker-js/faker";
import { client } from "#src/db.js";

const status = ["publish", "future", "draft", "pending", "private"];

const users = Array.from({ length: 5000 }, (_, index) => [
  index + 1,
  faker.internet.userName(),
  faker.internet.password(),
  faker.person.firstName(),
  faker.person.lastName(),
  faker.internet.email(),
  faker.date.past(),
]);

const categoriesNames = [
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
];

const categories = categoriesNames.map((name, index) => [
  index + 1,
  name,
  faker.lorem.sentences(),
  faker.helpers.slugify(name),
]);

const postsTitles = Array.from({ length: 5000 }, () => faker.lorem.sentence());

const posts = postsTitles.map((title, index) => [
  index + 1,
  title,
  faker.lorem.lines(),
  faker.helpers.slugify(title),
  faker.number.int({ min: 1, max: users.length }),
  faker.helpers.arrayElement(status),
  faker.helpers.maybe(() => faker.date.past(), { probability: 0.8 }),
  faker.date.past(),
]);

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

await client.connect();

try {
  await client.query("BEGIN");

  await client.query(
    `
        INSERT INTO status(status)
        VALUES ${status.map((_, index) => `($${index + 1})`).join(",")};
    `,
    status
  );

  await client.query(
    `
        INSERT INTO categories(category_id, category_name, description, slug)
        VALUES ${categories.map(
          (category, categoryIndex) =>
            `(${category
              .map(
                (_, paramIndex) =>
                  `$${category.length * categoryIndex + paramIndex + 1}`
              )
              .join(",")})`
        )};
    `,
    categories.flat()
  );

  await client.query(
    `
        INSERT INTO users(user_id, username, password, first_name, last_name, email, registered_at)
        VALUES ${users
          .map(
            (user, userIndex) =>
              `(${user
                .map(
                  (_, paramIndex) =>
                    `$${user.length * userIndex + paramIndex + 1}`
                )
                .join(",")})`
          )
          .join(",")};
    `,
    users.flat()
  );

  await client.query(
    `
        INSERT INTO posts(post_id, title, content, slug, author, status, published_at, updated_at)
        VALUES ${posts
          .map(
            (post, postIndex) =>
              `(${post
                .map(
                  (_, paramIndex) =>
                    `$${post.length * postIndex + paramIndex + 1}`
                )
                .join(",")})`
          )
          .join(",")};
    `,
    posts.flat()
  );

  await client.query(
    `
        INSERT INTO posts_categories(post_id, category_id)
        VALUES ${postsCategories
          .map(
            (postCategory, postCategoryIndex) =>
              `(${postCategory
                .map(
                  (_, paramIndex) =>
                    `$${
                      postCategory.length * postCategoryIndex + paramIndex + 1
                    }`
                )
                .join(",")})`
          )
          .join(",")};
    `,
    postsCategories.flat()
  );

  await client.query("COMMIT");

  console.log("Successfully created initial data");
} catch (error) {
  await client.query("ROLLBACK");

  console.error("Error while creating initial data");
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end();
}
