const { gql } = require('apollo-server-express');

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
}

type BlogPost {
  _id: ID
  title: String!
  author: String!
  postBody: String!
  postDate: String
}

type Cart {
  products: [Product]
}

type Auth {
  token: ID!
  user: User
}

type Query {
  currentUser: User
  allUsers: [User]
  specificUser(email: String!): User
  allProducts: [Product]
  specificProduct(id: String!): Product
  allBlogPosts: [BlogPost]
  specificBlogPost(id: String!): BlogPost 
}

type Mutation {
  createUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
  createProduct(name: String!, price: Float!, imageLink: String!, description: String!, inventory: Int): Product
  addProductToCart(cartId: ID!, productName: String!): Cart
  removeProductFromCart(cartId: ID!, productName: String!): Cart
  createBlogPost(title: String!, author: String!, postBody: String!, postedAt: String): BlogPost
}
`;

module.exports = typeDefs;
