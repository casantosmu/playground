import { faker } from "@faker-js/faker";
import path from "node:path";
import fs from "node:fs";

const getRandomIdFromRecords = (records) =>
  faker.number.int({ min: 1, max: records.length });

const slug = (string) => faker.helpers.slugify(string).toLowerCase();

const status = ["publish", "future", "draft", "pending", "private"].map(
  (status) => ({ status })
);

const users = Array.from({ length: 1_000 }, (_, index) => ({
  user_id: index + 1,
  username: faker.internet.userName(),
  password: faker.internet.password(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  registered_at: faker.date.past(),
}));

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
].map((name, index) => ({
  category_id: index + 1,
  name: name,
  description: faker.lorem.sentences(),
  slug: slug(name),
}));

const posts = Array.from({ length: 20_000 }, (_, index) => {
  const title = faker.lorem.sentence();
  return {
    post_id: index + 1,
    title: title,
    content: faker.lorem.lines(),
    slug: slug(title),
    user_id: getRandomIdFromRecords(users),
    status: faker.helpers.arrayElement(status.map(({ status }) => status)),
    published_at: faker.helpers.maybe(() => faker.date.past(), {
      probability: 0.8,
    }),
    updated_at: faker.date.past(),
  };
});

const postsCategories = [];
const comments = [];
for (const post of posts) {
  const uniqueCategoriesIds = new Set(
    faker.helpers.multiple(() => getRandomIdFromRecords(categories), {
      count: { min: 1, max: 7 },
    })
  );

  for (const categoryId of uniqueCategoriesIds) {
    postsCategories.push({ post_id: post.post_id, category_id: categoryId });
  }

  faker.helpers.multiple(
    () => {
      comments.push({
        comment_id: comments.length + 1,
        content: faker.lorem.lines(),
        user_id: getRandomIdFromRecords(users),
        post_id: post.post_id,
        published_at: faker.date.past(),
      });
    },
    { count: { min: 0, max: 35 } }
  );
}

const filePath = path.join(import.meta.dirname, "..", "dataset.json");
const fileContent = JSON.stringify({
  status,
  users,
  categories,
  posts,
  postsCategories,
  comments,
});

fs.writeFileSync(filePath, fileContent);

console.log("Data generation completed successfully!");
