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
  _id: ID
  productIds: [ID]
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
  login(email: String!, password: String!): Auth
  createProduct(name: String!, price: Float!, imageLink: String!, description: String!, inventory: Int): Product
  createCart: Cart
  addProductToCart(cartId: ID!, productId: ID!): Cart
  removeProductFromCart(cartId: ID!, productId: ID!): Cart
  createBlogPost(title: String!, author: String!, postBody: String!, postedAt: String): BlogPost
}
`;

module.exports = typeDefs;
