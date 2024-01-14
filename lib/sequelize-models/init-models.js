import { DataTypes } from "sequelize";
import CategoryModel from "./category.js";
import CommentModel from "./comment.js";
import PostModel from "./post.js";
import PostCategoryModel from "./post-category.js";
import StatusModel from "./status.js";
import UserModel from "./user.js";

export default function initModels(sequelize) {
  const Category = CategoryModel.init(sequelize, DataTypes);
  const Comment = CommentModel.init(sequelize, DataTypes);
  const Post = PostModel.init(sequelize, DataTypes);
  const PostCategory = PostCategoryModel.init(sequelize, DataTypes);
  const Status = StatusModel.init(sequelize, DataTypes);
  const User = UserModel.init(sequelize, DataTypes);

  Category.belongsToMany(Post, {
    as: "posts",
    through: PostCategory,
    foreignKey: "categoryId",
    otherKey: "postId",
  });
  Post.belongsToMany(Category, {
    as: "categories",
    through: PostCategory,
    foreignKey: "postId",
    otherKey: "categoryId",
  });
  PostCategory.belongsTo(Category, {
    as: "category",
    foreignKey: "categoryId",
  });
  Category.hasMany(PostCategory, {
    as: "postsCategories",
    foreignKey: "categoryId",
  });
  Comment.belongsTo(Post, { as: "post", foreignKey: "postId" });
  Post.hasMany(Comment, { as: "comments", foreignKey: "postId" });
  PostCategory.belongsTo(Post, { as: "post", foreignKey: "postId" });
  Post.hasMany(PostCategory, {
    as: "postsCategories",
    foreignKey: "postId",
  });
  Post.belongsTo(Status, {
    as: "statusStatus",
    foreignKey: "status",
  });
  Status.hasMany(Post, { as: "posts", foreignKey: "status" });
  Comment.belongsTo(User, { as: "author", foreignKey: "userId" });
  User.hasMany(Comment, { as: "comments", foreignKey: "userId" });
  Post.belongsTo(User, { as: "author", foreignKey: "userId" });
  User.hasMany(Post, { as: "posts", foreignKey: "userId" });

  return {
    Category,
    Comment,
    Post,
    PostCategory,
    Status,
    User,
  };
}
