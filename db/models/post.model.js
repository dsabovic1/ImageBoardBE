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
});

module.exports = mongoose.model("Post", postSchema);
