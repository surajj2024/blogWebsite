// controller/post.controller.js

import customError from "../utils/error.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

import Post from "../model/post.model.js";

// Get all posts
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .populate("comments");
    return res.json(posts);
  } catch (error) {
    console.log(error);
    next(new customError("Failed to retrieve posts", 500));
  }
};
export const getOnePost = async (req, res, next) => {
  const postId = req.params.id;
  console.log(postId);
  try {
    const post = await Post.findById(postId)
      .populate("author", "username")
      .populate("comments.user", "username");

    if (!post) {
      return next(new customError("Post not found", 404));
    }

    res.json(post);
  } catch (error) {
    next(new customError("Failed to retrieve posts", 500));
  }
};

// Create a new post
export const createPost = async (req, res, next) => {
  const { title, content, tags } = req.body;
  console.log();
  let imageURL;

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageURL = result.secure_url;

      // Clean up the temporary file
      fs.unlinkSync(req.file.path);
    } catch (error) {
      return next(new customError("Failed to upload image", 500));
    }
  }

  const post = new Post({
    title,
    content,
    author: req.user._id,
    tags,
    imageSource: imageURL,
  });

  try {
    await Post.create(post);

    const newPost = await Post.findById(post._id).populate({
      path: "author",
      select: "username -_id",
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    next(new customError("Failed to create post", 400));
  }
};

// Update an existing post
export const updatePost = async (req, res, next) => {
  const toUpdate = {
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
  };

  Object.keys(toUpdate).forEach(
    (element) => toUpdate[element] === undefined && delete toUpdate[element]
  );

  let imageURL;
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageURL = result.secure_url;
      // Clean up the temporary file
      fs.unlinkSync(req.file.path);
    } catch (error) {
      return next(new customError("Failed to upload image", 500));
    }
  }

  if (imageURL) {
    toUpdate.imageSource = imageURL;
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, toUpdate, {
      new: true,
    });

    if (!updatedPost) {
      return next(new customError("Post not found", 404));
    }

    res.json(updatedPost);
  } catch (err) {
    console.log(err);
    next(new customError("Failed to update post", 400));
  }
};

// Delete a post
export const deletePost = async (req, res, next) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return next(new customError("Post not found", 404));
    }

    res.json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    next(new customError("Failed to delete post", 500));
  }
};
