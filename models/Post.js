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

  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

var Post = mongoose.model("Post", PostSchema);

module.exports = Post;