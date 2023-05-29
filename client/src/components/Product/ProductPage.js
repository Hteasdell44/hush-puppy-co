import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { SPECIFIC_PRODUCT } from "../../utils/queries";

export default function ProductPage() {

    const { id } = useParams();
    const { data } = useQuery(SPECIFIC_PRODUCT, {variables: { specificProductId: id } });
    const productInfo = data?.specificProduct || [];

    console.log(productInfo);

    return(

        <div id="product-display-container">

            <h2>{productInfo.name}</h2>

            <img src={productInfo.imageLink} />

            <h3>${productInfo.price}</h3>

            <button>Add To Cart</button>

            <h4>Description</h4>
            <p>{productInfo.description}</p>

        </div>

    );
};