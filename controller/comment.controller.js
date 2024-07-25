import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";
import customError from "../utils/error.js";

export const createComment = async (req, res, next) => {
  const { comment } = req.body;
  const postId = req.params.id;

  try {
    if (!comment) {
      throw new customError("Comment not found", 404);
    }

    if (!postId) {
      throw new customError("Post ID is required", 400);
    }

    const userId = req.user._id;

    const savedComment = new Comment({
      comment,
      user: userId,
      post: postId,
    });

    await Comment.create(savedComment);

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: savedComment._id },
    });

    const populatedComment = await Comment.findById(savedComment._id).populate(
      "user",
      "username email"
    );

    return res
      .status(201)
      .json({ message: "comment added successfully", populatedComment });
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  console.log(req.user);
  const { comment } = req.body;
  const commentId = req.params.id;
  const userId = req.user._id;
  if (!req.user) {
    throw new customError("Unauthorized request", 403);
  }

  try {
    if (!comment) {
      throw new customError("Comment is required", 400);
    }

    if (!commentId) {
      throw new customError("Comment ID is required", 400);
    }

    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
      throw new customError("Comment not found", 404);
    }

    if (existingComment.user.toString() !== userId.toString()) {
      throw new customError("Unauthorized request", 403);
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { comment },
      { new: true }
    ).populate("user", "username email");

    if (!updatedComment) {
      throw new customError("Comment not found", 404);
    }

    res.status(200).json({
      message: "Comment updated successfully",
      updatedComment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const userId = req.user._id;

    if (!req.user) {
      throw new customError("Unauthorized request", 403);
    }

    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      throw new customError("Comment not found", 404);
    }

    if (
      existingComment.user.toString() !== userId.toString() &&
      !req.user.isAdmin
    ) {
      throw new customError(
        "Forbidden: You do not have permission to delete this comment",
        403
      );
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
