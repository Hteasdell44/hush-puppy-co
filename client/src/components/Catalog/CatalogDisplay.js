import React from "react";
import { useQuery, gql } from "@apollo/client";

export default function CatalogDisplay() {
  const ALL_PRODUCTS = gql`
    query AllProducts {
      allProducts {
        _id
        name
        imageLink
        price
      }
    }
  `;

  const { data } = useQuery(ALL_PRODUCTS);
  const productList = data?.allProducts || [];

  return (
    <div id="catalog-display-container">
      <h2>Our Catalog</h2>
      <div id="product-card-container" className="d-flex flex-row flex-wrap">
        {productList.map((product) => (
          <a
            href={`/catalog/${product._id}`}
            className="col-10 col-md-5 col-xl-4 col-lg-4 product-card"
            key={product._id}
          >
            <div className="mb-3 product-info">
              <h4 id="card-header" className="text-light p-2 m-0">
                {product.name}
              </h4>
              <img src={product.imageLink} alt={product.name} />
              <h5 className="text-dark">${product.price}</h5>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
