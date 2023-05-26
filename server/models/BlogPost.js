const dateFormat = require('../utils/dateFormat');
const { Schema, model } = require('mongoose');

const blogPostSchema = new Schema({

  title: {
    type: String,
    required: true,
    trim: true,
  },

  author: {
    type: String,
    required: true,
    trim: true,
  },

  postBody: {
    type: String,
    required: true,
  },

  postDate: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },

});

const BlogPost = model('BlogPost', blogPostSchema);

module.exports = BlogPost;