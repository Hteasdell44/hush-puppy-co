import { useQuery } from "@apollo/client";
import { ALL_PRODUCTS } from "../../utils/queries";


export default function CatalogDisplay() {

    const { data } =  useQuery(ALL_PRODUCTS);
    const productList = data?.allProducts || [];

    return(

        <div id="catalog-display-container">

            <h2>Our Catalog</h2>

            <div id="product-card-container" className="d-flex flex-row flex-wrap">

                {productList && productList.map((product) => (

                    <a href={`/catalog/${product._id}`} className="col-10 col-md-5 col-xl-4 col-lg-4 product-card">

                        <div key={product._id}>

                            <div className="mb-3 product-info">
                        
                                <h4 id="card-header" className="text-light p-2 m-0">{product.name}</h4>
                                <img src={product.imageLink} />
                                <h5 className="text-dark">${product.price}</h5>
                        
                            </div>

                        </div>

                    </a>
                ))}

            </div>

        </div>
    );
};