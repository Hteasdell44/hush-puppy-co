const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const BlogPost = require('../models/BlogPost');

const resolvers = {

  Query: {

    specificUser: async (parent, args) => {
      return User.findOne({ email: args.email });
    },

    allProducts: async (parent, args) => {
      return Product.find({});
    },

    specificProduct: async (parent, args) => {
      return Product.findOne({ _id: args.id });
    },

    allBlogPosts: async (parent, args) => {
      return BlogPost.find({});
    },

    specificBlogPost: async (parent, args) => {
      return BlogPost.findOne({ _id: args.id });
    }
   },


  Mutation: {

    createUser: async (parent, args) => {
      const newUser = await User.create(args);
      return newUser;
    },

    createProduct: async (parent, args) => {
      const newProduct = await Product.create(args);
      return newProduct;
    },

    addProductToCart: async (parent, args) => {

      const productToAdd = Product.findOne({ name: args.productName });

      const updatedCart = Cart.updateOne(
        { _id: args.cartId },
        { $addToSet: { products: productToAdd }},
        { new: true}
      );

      return updatedCart;
    },

    removeProductFromCart: async (parent, args) => {
      const productToRemove = Product.findOne({ name: args.productName });
      const updatedCart = Cart.updateOne(
        { _id: args.cartId },
        { $pull: { products: productToRemove }},
        { new: true }
      );

      return updatedCart;
    },

    createBlogPost: async (parent, args) => {
      const newPost = await BlogPost.create(args);
      return newPost;
    },

  }

};


module.exports = resolvers;
