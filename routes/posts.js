const express = require("express");
const router = express.Router();
const multer = require("multer");
const Post = require("../db/models/post.model");
const jwt = require("jsonwebtoken");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const { User } = require("../db/models/user.model");

// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
  let token = req.header("x-access-token");

  jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
    if (err) {
      res.status(401).send(err);
    } else {
      req.user_id = decoded._id;
      next();
    }
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});
router.post(
  "",
  [multer({ storage: storage }).single("image"), authenticate],
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      userId: "5",
      content: req.body.content,
      likesCount: 0,
      liked: [],
      imagePath: url + "/images/" + req.file.filename,
      _userId: req.body._userId,
    });
    console.log(post);
    post.save().then((result) => {
      res.status(201).json({
        message: "Post added succesfully!",
        post: {
          id: result._id,
          userId: result.id,
          content: result.content,
          likesCount: 0,
          liked: [],
          imagePath: result.imagePath,
        },
      });
    });
  }
);

router.put("/:id", authenticate, (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({
      message: "Update successful!",
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "Post not found!",
      });
    }
  });
});

router.get("", (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Posts fetched succesfully!",
      posts: documents,
    });
  });
});

router.post("/like", (req, res, next) => {
  console.log(req.body);
  Post.find(
    {
      _id: req.body.postId,
    },
    {
      likesCount: 1,
      liked: {
        $elemMatch: { $eq: req.body.userId },
      },
    }
  ).then((documents) => {
    console.log(documents);
    if (documents[0].liked.length == 0) {
      Post.updateOne(
        {
          _id: req.body.postId,
        },
        {
          $inc: { likesCount: 1 },
          $push: { liked: req.body.userId },
        }
      ).then((doc) => {
        res.status(200).json({
          message: "Likes updated succesfully!",
          posts: doc,
          newLikeCount: documents[0].likesCount + 1,
          postId: documents[0]._id,
        });
      });
    } else {
      Post.updateOne(
        {
          _id: req.body.postId,
        },
        {
          $inc: { likesCount: -1 },
          $pull: { liked: req.body.userId },
        }
      ).then((doc) => {
        res.status(200).json({
          message: "Likes updated succesfully!",
          posts: doc,
          newLikeCount: documents[0].likesCount - 1,
          postId: documents[0]._id,
        });
      });
    }
  });
});

router.post("/nesto", (req, res, next) => {
  Post.updateOne(
    { $inc: { likesCount: 1 } }
  ).then((documents) => {
    res.status(200).json({
      message: "Posts updated succesfully!",
      post: documents,
    });
  });
});

router.get("/user/:id", authenticate, (req, res, next) => {
  Post.findByUserId(req.params.id).then((posts) => {
    if (posts) {
      res.status(200).json({
        posts: posts,
      });
    } else {
      res.status(404).json({
        message: "Post not found!",
      });
    }
  });
});

router.delete("/:id", authenticate, (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post deleted" });
  });
});

module.exports = router;
