import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const CREATE_USER = gql`
    mutation CreateUser($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
        createUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
          token
          user {
            _id
          }
        }
    }
`;

export const UPDATE_USER = gql`
    mutation Mutation($userId: ID!, $firstName: String, $lastName: String, $email: String) {
      updateUser(userId: $userId, firstName: $firstName, lastName: $lastName, email: $email) {
        _id
        email
        firstName
        lastName
        password
      }
    }
`;

export const INCREASE_AMOUNT_IN_CART = gql`
    mutation IncreaseAmountInCart($productId: ID!) {
      increaseAmountInCart(productId: $productId) {
        _id
        name
        amountInCart
      }
    }
`;

export const DECREASE_AMOUNT_IN_CART = gql`
    mutation DecreaseAmountInCart($productId: ID!) {
      decreaseAmountInCart(productId: $productId) {
        _id
        name
        amountInCart
      }
    }
`;

export const CREATE_PRODUCT = gql`
    mutation CreateProduct($name: String!, $price: Float!, $imageLink: String!, $description: String!) {
        createProduct(name: $name, price: $price, imageLink: $imageLink, description: $description) {
          _id
          name
          price
          imageLink
          description
          inventory
        }
    }
`;

export const CREATE_CART = gql`
    mutation Mutation {
      createCart {
        _id
        productIds {
          _id
        }
      }
    }
`;

export const ADD_PRODUCT_TO_CART = gql`
    mutation Mutation($cartId: ID!, $productId: ID!) {
      addProductToCart(cartId: $cartId, productId: $productId) {
        _id
        productIds {
          _id
          amountInCart
        }
      }
    }
`;

export const REMOVE_PRODUCT_FROM_CART = gql`
    mutation RemoveProductFromCart($cartId: ID!, $productId: ID!) {
        removeProductFromCart(cartId: $cartId, productId: $productId) {
          _id
          productIds {
            _id
            amountInCart
          }
        }
    }
`;

export const CREATE_BLOG_POST = gql`
mutation CreateBlogPost($title: String!, $author: String!, $postBody: String!) {
    createBlogPost(title: $title, author: $author, postBody: $postBody) {
      _id
      title
      author
      postDate
      postBody
    }
  }
`;

