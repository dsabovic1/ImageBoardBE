const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  userId : {
    type: String
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likesCount : Number,
  liked : [Number],
  imagePath: { type: String, required: true },
  _userId: {
    type: mongoose.Types.ObjectId,
  },
});

/* STATIC METHODS */
postSchema.statics.findByUserId = function (_userId) {
  console.log(_userId);
  const Post = this;

  return Post.find({
    _userId,
  });
};

module.exports = mongoose.model("Post", postSchema);
