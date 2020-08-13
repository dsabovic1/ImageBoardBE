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
  liked : [String],
  comments : [{
    username: String,
    text: String
  }],
  imagePath: { type: String, required: true },
});

module.exports = mongoose.model("Post", postSchema);
