// netlify/functions/graphql.js
const { ApolloServer, gql } = require('apollo-server-lambda');
const mongoose = require('mongoose');
const User = require('../../server/models/User');
const Product = require('../../server/models/Product');
const Cart = require('../../server/models/Cart');
const BlogPost = require('../../server/models/BlogPost');
const { signToken } = require('../../server/utils/auth');
const { AuthenticationError } = require('apollo-server-lambda');

// Connect to MongoDB (replace with your actual MongoDB connection string)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define your GraphQL schema
const typeDefs = gql`
type User {
  _id: ID
  firstName: String!
  lastName: String!
  email: String!
  password: String!
  isAdmin: Boolean!
}

type Product {
  _id: ID
  name: String!
  price: Float!
  imageLink: String!
  description: String!
  inventory: Int
  amountInCart: Int
  stripeId: String
}

type BlogPost {
  _id: ID
  title: String!
  author: String!
  postBody: String!
  postDate: String
}

type Cart {
  _id: ID
  productIds: [Product]
}

type Auth {
  token: ID!
  user: User
}

type Query {
  allUsers: [User]
  specificUser(email: String!): User
  allProducts: [Product]
  specificProduct(id: String!): Product
  specificCart(id: String!): Cart
  allCarts: [Cart]
  allBlogPosts: [BlogPost]
  specificBlogPost(id: String!): BlogPost 
}

type Mutation {
  createUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
  updateUser(userId: ID!, firstName: String, lastName: String, email: String): User
  increaseAmountInCart(productId: ID!): Product
  decreaseAmountInCart(productId: ID!): Product
  login(email: String!, password: String!): Auth
  createProduct(name: String!, price: Float!, imageLink: String!, description: String!, inventory: Int): Product
  createCart: Cart
  addProductToCart(cartId: ID!, productId: ID!): Cart
  removeProductFromCart(cartId: ID!, productId: ID!): Cart
  createBlogPost(title: String!, author: String!, postBody: String!, postedAt: String): BlogPost
}
`;

// Define your resolvers
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

// Create the Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
});

exports.handler = async (event, context) => {
  const handler = server.createHandler({
    cors: {
      origin: 'https://thehushpuppyco.netlify.app', // Replace with your front-end URL
      credentials: true,
    },
  });

  return new Promise((resolve, reject) => {
    handler(event, context, (error, body) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          statusCode: 200,
          body: body,
          headers: {
            'Access-Control-Allow-Origin': 'https://thehushpuppyco.netlify.app', // Replace with your front-end URL
            'Access-Control-Allow-Credentials': true,
          },
        });
      }
    });
  });
};