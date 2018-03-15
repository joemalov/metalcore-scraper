var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: {
    type: String
  },
  summary: {
    type: String
  },
  img: {
    type: String
  },
  // `link` is required and of type String
  link: {
    type: String,
    unique: true,
    required: true
  },
  date: {
    type: String
  },
  published: {
    type: String
  },
  // `comments` is an object that stores a Comment ids
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

var Post = mongoose.model("Post", PostSchema);

// Export the Article model
module.exports = Post;