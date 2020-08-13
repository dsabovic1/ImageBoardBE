const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likesCount: Number,
  liked: [Object],
  imagePath: { type: String, required: true },
  _userId: {
    type: mongoose.Types.ObjectId,
    required: true,
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
