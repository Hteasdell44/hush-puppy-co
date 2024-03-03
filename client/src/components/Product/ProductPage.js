import { useParams } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
// import { SPECIFIC_CART, SPECIFIC_PRODUCT } from "../../utils/queries";
// import { ADD_PRODUCT_TO_CART, CREATE_CART } from "../../utils/mutations";
import { useEffect, useRef } from 'react';

export default function ProductPage() {

    const SPECIFIC_PRODUCT = gql`
        query SpecificProduct($specificProductId: String!) {
        specificProduct(id: $specificProductId) {
            name
            imageLink
            price
            description
            inventory
            amountInCart
        }
        }
    `;

    const SPECIFIC_CART = gql`
        query SpecificCart($specificCartId: String!) {
        specificCart(id: $specificCartId) {
            _id
            productIds {
            _id
            name
            price
            imageLink
            amountInCart
            }
        }
        }
    `;
    
    const ADD_PRODUCT_TO_CART = gql`
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

    const CREATE_CART = gql`
        mutation Mutation {
        createCart {
            _id
            productIds {
            _id
            }
        }
        }
    `;

    const { id } = useParams();
    const { data } = useQuery(SPECIFIC_PRODUCT, {variables: { specificProductId: id } });
    const productInfo = data?.specificProduct || [];
    
    let cartId = sessionStorage.getItem('cartId');

    const [createCart, { data: cartData }] = useMutation(CREATE_CART);

    const [addProductToCart, { data: updatedCartData }] = useMutation(ADD_PRODUCT_TO_CART);

    const handleCartCreation = async () => {
        const newCart = await createCart({});
        sessionStorage.removeItem(`cartId`);
        sessionStorage.setItem('cartId', newCart.data?.createCart?._id);
        cartId = sessionStorage.getItem('cartId'); 
    }

    if (cartId == null) {
        handleCartCreation();
    }

    const handleAddToCart = async () => {

        const updatedCart = await addProductToCart({ variables: { cartId: cartId, productId: id }});

        window.location.assign("/cart");

        return updatedCart;
        
    }

    return(

        <div id="product-display-container">

            <h2>{productInfo.name}</h2>

            <img src={productInfo.imageLink} />

            <h3>${productInfo.price}</h3>

            <button onClick={handleAddToCart}>Add To Cart</button>

            <h4>Description</h4>
            <p>{productInfo.description}</p>

        </div>

    );
};