const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const BlogPost = require('../models/BlogPost');

const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {

  Query: {

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

    specificCart: async (parent, args) => {
      return Cart.findOne({ _id: args.id}).populate('productIds');
    },

    allCarts: async (parent, args) => {
      return Cart.find({});
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

    updateUser: async (parent, args) => {

      const updatedUser = await User.findOneAndUpdate(
        {_id: args.userId},
        {...args},
        {new: true}
      );

      return updatedUser;

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

    // updateProduct: async (parent, args) => {
    //   const updatedProduct = Product.findOneAndUpdate(
    //     { _id: args.productId },
    //     { $inc: { "amountInCart" : 1 }},
    //     { new: true}
    //   );
    // },

    createCart: async (parent, args) => {
      const cart = await Cart.create({});
      return cart;
    },

    addProductToCart: async (parent, args) => {

      const updatedCart = await Cart.findOneAndUpdate(
        { _id: args.cartId },
        { $addToSet: { productIds: args.productId }},
        { new: true}
      );

      const updatedProduct = await Product.updateOne(
        { _id: args.productId },
        { $inc: { amountInCart : 1 }}
      );

      return updatedCart;
    },

    increaseAmountInCart: async (parent, args) => {

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: args.productId },
        { $inc: { amountInCart : 1 }},
        { new: true }
      );
      
      return updatedProduct;
    },

    decreaseAmountInCart: async (parent, args) => {

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: args.productId },
        { $inc: { amountInCart : -1 }},
        { new: true }
      );

      return updatedProduct;
    },

    removeProductFromCart: async (parent, args) => {

      const updatedCart = await Cart.findOneAndUpdate(
        { _id: args.cartId },
        { $pull: { productIds: args.productId }},
        { new: true}
      );

      const updatedProduct = await Product.updateOne(
        { _id: args.productId },
        { $set: { amountInCart : 0 }}
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
