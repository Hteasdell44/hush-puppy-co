import { useQuery, useMutation } from "@apollo/client";
import { SPECIFIC_CART, SPECIFIC_PRODUCT } from "../../utils/queries";
import { REMOVE_PRODUCT_FROM_CART } from "../../utils/mutations";

export default function CartDisplay() {

    const cartId = sessionStorage.getItem('cartId');
   
    const { data: cartData } = useQuery(SPECIFIC_CART, {variables: { specificCartId: cartId } });

    const cartItems = cartData?.specificCart?.productIds || [];

    console.log(cartItems)

    const directToProducts = () => {
        window.location.assign('/catalog');
    }

    const [removeProductFromCart, { data: deletedCartData}] = useMutation(REMOVE_PRODUCT_FROM_CART);

    const removeFromCart = async (event) => {

        console.log(event.target.value);
        const updatedCart = await removeProductFromCart({ variables: { cartId: cartId, productId: event.target.value }});
        return updatedCart;
    }
    
    if (cartItems.length == 0) {

        return(

            <div id="cart-container">

                <h2>Shopping Cart</h2>

                <h3>You Haven't Added Any Items To Your Cart Yet!</h3>
                <button className="continue-shopping" onClick={directToProducts}>Shop Now</button>

            </div>
        )
    }

    return(

        <div id="cart-container">

            <h2>Shopping Cart</h2>

            {cartItems && cartItems.map((item, i) => (

                <div className="cart-card-container" key={item._id}>

                    <a href={`/catalog/${item._id}`} className="col-10 col-md-5 col-xl-4 col-lg-4 item-card">

                        <div className="cart-info-container">

                            <div className="mb-3 cart-info">
                        
                                <h4 id="card-header" className="text-light p-2 m-0">{item.name}</h4>
                                <h5 className="text-dark">${item.price}</h5>
                                <img src={item.imageLink} />
                                
                                
                        
                            </div>

                        </div>
                        

                    </a>
                    <button className="delete-button" value={item._id} onClick={(event) => removeFromCart(event)}>Remove</button>

                    <form className="quantity-form">
                        <label for="quantity">Quantity:</label>
                        <button className="quantity-buttons"><span>&#8595;</span></button>
                        <input placeholder={item.amountInCart} type="number" name="quantity" min="1" max={item.inventory} readOnly/>
                        <button className="quantity-buttons"><span>&#8593;</span></button>
                    </form>

                </div>

            ))}

            <button className="continue-shopping" onClick={directToProducts}>Continue Shopping</button>
            <button id ="checkout-button">Checkout</button>
        

        </div>

    );
}