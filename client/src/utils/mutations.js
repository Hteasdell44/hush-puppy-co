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
        productIds
      }
    }
`;

export const ADD_PRODUCT_TO_CART = gql`
    mutation Mutation($cartId: ID!, $productId: ID!) {
      addProductToCart(cartId: $cartId, productId: $productId) {
        _id
        productIds
      }
    }
`;

export const REMOVE_PRODUCT_FROM_CART = gql`
    mutation RemoveProductFromCart($cartId: ID!, $productId: ID!) {
        removeProductFromCart(cartId: $cartId, productId: $productId) {
          _id
          productIds
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

