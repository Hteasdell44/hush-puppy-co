const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const BlogPost = require('../models/BlogPost');

const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {

  Query: {

    currentUser: async (parent, args, context) => {

      if (context.user) {
        console.log("hello");
        return User.findOne({ _id: contextValue.user._id });
      }
      // throw new AuthenticationError('You need to be logged in!');
    },

    allUsers: async (parent, args) => {
      return User.find({});
    },

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

      const userExists = await User.findOne({ email: args.email });

      if (userExists) {
        throw new AuthenticationError('User with that email already exists!');
      }

      const newUser = await User.create({ ...args });
      const token = signToken(newUser);
      return { token, newUser };
    },

    login: async (parent, { email, password }) => {

      const userExists = await User.findOne({ email });

      if (!userExists) {
        throw new AuthenticationError('No user found with that email!');
      }

      if (password !== userExists.password) {
        throw new AuthenticationError('Your password is incorrect!');
      }

      const token = signToken(userExists);
      return { token, userExists };
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
