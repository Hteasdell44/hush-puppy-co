import { useParams } from "react-router-dom";
import { useQuery, useMutation, } from "@apollo/client";
import { SPECIFIC_CART, SPECIFIC_PRODUCT } from "../../utils/queries";
import { ADD_PRODUCT_TO_CART, CREATE_CART } from "../../utils/mutations";
import { useEffect, useRef } from 'react';

export default function ProductPage() {

    const { id } = useParams();
    const { data } = useQuery(SPECIFIC_PRODUCT, {variables: { specificProductId: id } });
    const productInfo = data?.specificProduct || [];
    let cartId;

    const count = useRef(0);

    const [createCart, { data: cartData }] = useMutation(CREATE_CART);

    const [addProductToCart, { data: updatedCartData }] = useMutation(ADD_PRODUCT_TO_CART);

    cartId = sessionStorage.getItem('cartId');

    const { data: specificCartData } = useQuery(SPECIFIC_CART, {variables: { specificCartId: cartId }});
    const cartValid = JSON.stringify(specificCartData?.specificCart);

    useEffect( async () => {

        if (cartId == null) {
            const newCart = await createCart({});
            sessionStorage.removeItem(`cartId`);
            sessionStorage.setItem('cartId', newCart.data?.createCart?._id);
            cartId = sessionStorage.getItem('cartId'); 
        }

        count.current++;
        
      },);

      const handleAddToCart = async () => {

        const updatedCart = await addProductToCart({ variables: { cartId: cartId, productId: id }});
        
        const index = updatedCart?.data?.addProductToCart?.productIds.length - 1;

        sessionStorage.removeItem(`cartProductName-${index}`);
        sessionStorage.setItem(`cartProductName-${index}`, productInfo.name);

        sessionStorage.removeItem(`cartProductPrice-${index}`);
        sessionStorage.setItem(`cartProductPrice-${index}`, productInfo.price);

        sessionStorage.removeItem(`cartProductImageLink-${index}`);
        sessionStorage.setItem(`cartProductImageLink-${index}`, productInfo.imageLink);

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