const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load validation
const validatePostInput = require("../../validation/post");

// Load models
const Post = require("../../models/Post");
const Seller = require("../../models/Seller");

// @route   GET api/posts/test
// @desc    Test post route
// @access   Public
router.get("/test", (req, res) => res.json({ msg: "This is post test" }));

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that ID" })
    );
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      seller: req.user.id
    });

    newPost
      .save()
      .then(post => res.json(post))
      .catch(err => {
        console.log("Inside catch");
        console.log("error: ", err);
      });
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Seller.findOne({ seller: req.user.id }).then(seller => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for the post owner
          if (post.seller.toString() != req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          // Delete post
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to a post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          user: req.user.id
        };

        //Add to comment's array
        post.comments.unshift(newComment);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "no post found" }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove a comment from post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        const reqCommentId = req.params.comment_id;
        const userId = req.user.id;

        // Check to see if comment exist
        const comment = post.comments.find(
          comment => comment._id == reqCommentId
        );
        // Checking comment owner
        if (comment) {
          if (comment.user == userId) {
            const updatedCommentsList = post.comments.filter(
              comment => comment._id != reqCommentId
            );

            Post.findByIdAndUpdate(
              post._id,
              { comments: updatedCommentsList },
              { new: true }
            ).then(updatedPost => {
              res.send(updatedPost);
            });
          } else {
            res.status(422).send({
              message: "Unauthorized user"
            });
          }
        } else {
          res.status(500).send({
            message: "Comment doesn't exist"
          });
        }
      })
      .catch(err => res.status(404).json({ message: "No post found" }));
    // .catch(err => console.log("Err", err));
  }
);

// @route   POST api/posts/rate/:id
// @desc    Rate a post
// @access  Private
router.post(
  "/rate/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Seller.findOne({ user: req.user.id }).then(seller => {
      Post.findById(req.params.id)
        .then(post => {
          // // Check to see if rate exist
          // const rate = post.rates.find(
          //   rate => rate._id == reqCommentId
          // );

          // if (
          //   post.rates.filter(rate => rate.user.toString() === req.user.id)
          //     .length > 0
          // ) {
          //   return res
          //     .status(400)
          //     .json({ message: "User already rated this post" });
          // }

          //Add user id to rate's array
          post.rates.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        // .catch(err => res.status(404).json({ postnotfound: "No post found" }));
        .catch(err => console.log("Err", err));
    });
  }
);

module.exports = router;
