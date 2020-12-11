const Post = require("../../../models/post");
const Comment = require("../../../models/comment");
const passport = require("passport");
module.exports.create = async function (req, res) {
  console.log(req.user);
  // console.log(req.body);
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    // Post.find({}).populate('user')
    // .exec() is used with a query while .execPopulate() is used with a document
    post = await post
      .populate("user", "name")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
        populate: {
          path: "likes",
        },
      })
      .populate("likes")
      .execPopulate();
    return res.status(200).json({
      success: true,
      data: {
        post: post,
      },
      message: "Post created",
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "internal server error",
    });
  }
};
module.exports.index = async function (req, res) {
  // console.log(req.query);
  const limit = parseInt(req.query.limit);
  console.log(limit);
  let posts = await Post.find({})
    .sort("-createdAt")
    .limit(limit)
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
      populate: {
        path: "likes",
      },
    })
    .populate("likes");
  // console.log(posts);
  return res.json(200, {
    message: "list of posts",
    success: true,
    data: {
      next: {
        page: req.query.page,
        limit: req.query.limit,
      },
      posts: posts,
    },
  });
};
module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      post.remove();
      await Comment.deleteMany({ post: req.params.id });
      return res.json(200, {
        message: "post and assosciated comment deleted successfully",
      });
    } else {
      return res.json(401, {
        message: "you can not delete this post",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "internal server error",
    });
  }
};
