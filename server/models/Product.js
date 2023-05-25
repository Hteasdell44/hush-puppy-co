const { Schema, model } = require('mongoose');

const productSchema = new Schema({

  name: {
    type: String,
    required: true,
  },

  imageLink: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  inventory: {
    type: Number,
  },

});

const Product = model('Product', productSchema);

module.exports = { Product };