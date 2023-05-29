import { gql } from '@apollo/client';

export const SPECIFIC_USER = gql`
    query SpecificUser($email: String!) {
        specificUser(email: $email) {
          _id
          firstName
          lastName
          email
          password
          isAdmin
        }
    }
`;

export const ALL_PRODUCTS = gql`
    query AllProducts {
        allProducts {
          _id
          name
          price
          description
          imageLink
          inventory
        }
    }
`;

export const SPECIFIC_PRODUCT = gql`
    query SpecificProduct($specificProductId: String!) {
      specificProduct(id: $specificProductId) {
        name
        imageLink
        price
        description
        inventory
      }
    }
`;

export const ALL_BLOG_POSTS = gql`
    query AllBlogPosts {
        allBlogPosts {
          _id
          title
          author
          postDate
          postBody
        }
    }
`;


