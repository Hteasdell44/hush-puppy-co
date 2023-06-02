const { Schema, model } = require('mongoose');

const productSchema = new Schema({

  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
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

  amountInCart: {
    type: Number,
    default: 0,
  }

});

const Product = model('Product', productSchema);

module.exports = Product;