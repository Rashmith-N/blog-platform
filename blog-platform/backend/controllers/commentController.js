const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @route   GET /api/posts/:postId/comments
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username')
      .sort({ createdAt: 1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/posts/:postId/comments
const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      content,
    });

    await comment.populate('author', 'username');

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/posts/:postId/comments/:id
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const isCommentAuthor =
      comment.author.toString() === req.user._id.toString();

    const post = await Post.findById(comment.post);
    const isPostAuthor =
      post && post.author.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostAuthor) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getComments, addComment, deleteComment };
