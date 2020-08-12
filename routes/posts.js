const express = require("express");
const router = express.Router();
const multer = require("multer");
const Post = require("../db/models/post.model");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
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

router.post("",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      userId : "5",
      title: req.body.title,
      content: req.body.content,
      likesCount: 0,
      liked: [],
      imagePath: url + "/images/" + req.file.filename,
    });
    post.save().then((result) => {
      res.status(201).json({
        message: "Post added succesfully!",
        post: {
          id: result._id,
          userId : result.id,
          title: result.title,
          content: result.content,
          likesCount: 0,
          liked: [],
          imagePath: result.imagePath
        }
      });
    });
  }
);

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
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
  Post.find({
    "_id": req.body.postId
    },
    {
      "likesCount": 1,
      "liked": {
        "$elemMatch": { "$eq": req.body.userId }
      }
    }).then((documents) => {
      console.log(documents);
      if(documents[0].liked.length == 0) {
        Post.updateOne(
          { 
              "_id": req.body.postId
          },
          {
              "$inc": { "likesCount": 1 },
              "$push": { "liked": req.body.userId }
          }
        ).then((doc) => {
          res.status(200).json({
            message: "Likes updated succesfully!",
            posts: doc,
            newLikeCount: documents[0].likesCount + 1,
            postId: documents[0]._id
          });
        });
      } else {
        Post.updateOne(
          { 
              "_id": req.body.postId
          },
          {
              "$inc": { "likesCount": -1 },
              "$pull": { "liked": req.body.userId }
          }
        ).then((doc) => {
          res.status(200).json({
            message: "Likes updated succesfully!",
            posts: doc,
            newLikeCount : documents[0].likesCount - 1,
            postId: documents[0]._id
          });
        });
      }
    });
});

router.post("/nesto", (req, res, next) => {
  Post.updateOne(
    // find record with name "MyServer"
    { title: "arslan" },
    // increment it's property called "ran" by 1
    { $inc: { likesCount: 1 } }
  ).then((documents) => {
    res.status(200).json({
      message: "Posts updated succesfully!",
      post: documents,
    });
  });
});

router.delete("/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post deleted" });
  });
});

module.exports = router;
