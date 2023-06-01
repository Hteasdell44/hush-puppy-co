import { useQuery, useMutation } from "@apollo/client";
import { SPECIFIC_CART, SPECIFIC_PRODUCT } from "../../utils/queries";
import { REMOVE_PRODUCT_FROM_CART } from "../../utils/mutations";

export default function CartDisplay() {

    const cartId = sessionStorage.getItem('cartId');
    const { data: cartData } = useQuery(SPECIFIC_CART, {variables: { specificCartId: cartId } });

    const cartItems = cartData?.specificCart?.productIds || [];

    let productArr = [];

    const directToProducts = () => {
        window.location.assign('/catalog');
    }

    // It's grabbing the correct id and removing it from the DB, but since i'm pulling from session storage, as I delete it is messing up the order of the map function that renders the cart list.
    // So, I need to try again to figure out how to render the list directly from the DB.

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
                <button onClick={directToProducts}>Shop Now</button>

            </div>
        )
    }

    return(

        <div id="cart-container">

            <h2>Shopping Cart</h2>

            {cartItems && cartItems.map((item, i) => (

                <div key={i}>

                    <a href={`/catalog/${item}`} className="col-10 col-md-5 col-xl-4 col-lg-4 item-card">

                        <div>

                            <div className="mb-3 cart-info">
                        
                                <h4 id="card-header" className="text-light p-2 m-0">{sessionStorage.getItem(`cartProductName-${i}`)}</h4>
                                <img src={sessionStorage.getItem(`cartProductImageLink-${i}`)} />
                                <h5 className="text-dark">{sessionStorage.getItem(`cartProductPrice-${i}`)}</h5>
                        
                            </div>

                        </div>

                    </a>

                    <button value={item} onClick={(event) => removeFromCart(event)}>Remove</button>

                </div>

            ))}

        </div>

    );
}