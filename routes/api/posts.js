const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("File type should be jpeg or png"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //files more than 5MB will not be accepted
  },
  fileFilter: fileFilter,
});

// Load validation
const validatePostInput = require("../../validation/post");
const validateRateInput = require("../../validation/rate");

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
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ msg: "No posts found" }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) =>
      res.status(404).json({ msg: "No post found with that ID" })
    );
});

// // @route   POST api/posts/:seller_id
// // @desc    Create post
// // @access  Private
// router.post(
//   "/:seller_id",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     const { errors, isValid } = validatePostInput(req.body);

//     // Check validation
//     if (!isValid) {
//       return res.status(400).json(errors);
//     }

//     const newPost = new Post({
//       text: req.body.text,
//       name: req.body.name,
//       seller: req.params.seller_id
//     });

//     newPost
//       .save()
//       .then(post => res.json(post))
//       .catch(err => {
//         console.log("Inside catch");
//         console.log("error: ", err);
//       });
//   }
// );

// @route   POST api/posts/:id
// @desc    Create post
// @access  Private
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  upload.array("postImage", 4),
  (req, res) => {
    let filesPath = [];
    req.files.forEach((file) => filesPath.push(file.path));

    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Seller.findById(req.params.id)
      .then((seller) => {
        const newPost = new Post({
          text: req.body.text,
          name: req.body.name,
          postImage: filesPath,
          seller: req.params.id,
        });

        console.log("post", newPost);

        newPost
          .save()
          .then((post) => res.json(post))
          .catch((err) => {
            console.log("errors: ", err);
          });
      })
      // .catch(err =>
      //   res.status(404).json({ msg: "Requesting user is not a seller" })
      .catch((err) => {
        console.log("error: ", err, "seller id: ", req.params.id);
      });
  }
);

// @route   POST api/posts/:id
// @desc    Edit a post
// @access  Private
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Seller.findOne({ seller: req.user.id }).then((seller) => {
      Post.findById(req.params.id)
        .then((post) => {
          // Check for the post owner
          if (post.seller.toString() != req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          // Update post
          if (post) {
            Post.findOneAndUpdate(
              { _id: req.params.id },
              {
                $set: {
                  text: req.body.text,
                  name: req.body.name,
                  date: Date.now(),
                },
              },
              { new: true }
            )
              .then((post) => res.json(post))
              .catch((error) => {
                throw error;
              });
          }
        })
        .catch((err) => res.status(404).json({ msg: "No post found" }));
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
    Seller.findOne({ seller: req.user.id }).then((seller) => {
      Post.findById(req.params.id)
        .then((post) => {
          // Check for the post owner
          if (post.seller.toString() != req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          // Delete post
          post.remove().then(() => res.json({ success: true }));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "No post found" })
        );
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
      .then((post) => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          user: req.user.id,
        };

        //Add to comment's array
        post.comments.unshift(newComment);

        // Save
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "no post found" }));
  }
);

// @route   POST api/posts/comment/:id/:comment_id
// @desc    Edit a comment in a post
// @access  Private
router.post(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then((post) => {
        const reqCommentId = req.params.comment_id;
        const userId = req.user.id;

        // Check to see if comment exist
        const comment = post.comments.find(
          (comment) => comment._id == reqCommentId
        );

        // Checking comment owner
        if (comment) {
          if (comment.user == userId) {
            comment.text = req.body.text;
            comment.date = Date.now();
            post
              .save()
              .then((post) => res.json(post))
              .catch((error) => {
                throw error;
              });
          } else {
            res.status(422).send({
              message: "Unauthorized user",
            });
          }
        } else {
          res.status(500).send({
            message: "Comment doesn't exist",
          });
        }
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
    // .catch(err => console.log("Err", err));
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
      .then((post) => {
        const reqCommentId = req.params.comment_id;
        const userId = req.user.id;

        // Check to see if comment exist
        const comment = post.comments.find(
          (comment) => comment._id == reqCommentId
        );
        // Checking comment owner
        if (comment) {
          if (comment.user == userId) {
            const updatedCommentsList = post.comments.filter(
              (comment) => comment._id != reqCommentId
            );

            Post.findByIdAndUpdate(
              post._id,
              { comments: updatedCommentsList },
              { new: true }
            ).then((updatedPost) => {
              res.send(updatedPost);
            });
          } else {
            res.status(422).send({
              message: "Unauthorized user",
            });
          }
        } else {
          res.status(500).send({
            message: "Comment doesn't exist",
          });
        }
      })
      .catch((err) => res.status(404).json({ message: "No post found" }));
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
    const { errors, isValid } = validateRateInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Seller.findOne({ user: req.user.id }).then((seller) => {
      Post.findById(req.params.id)
        .then((post) => {
          // check to see if user has already rated the post
          if (
            post.rates.filter((rate) => rate.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ message: "User already rated this post" });
          }

          // New Rate
          else {
            Post.findById(req.params.id).then((post) => {
              const newRate = {
                star: req.body.star,
                user: req.user.id,
              };

              //Add user id & rating to rate's array
              post.rates.unshift(newRate);

              // Save
              post.save().then((post) => res.json(post));
            });
          }
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "No post found" })
        );
      // .catch(err => console.log("Err", err));
    });
  }
);

module.exports = router;
