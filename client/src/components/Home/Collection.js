import CalmTreatsPhoto from "../../utils/img/calm-treats.jpeg";
import CalmToyPhoto from "../../utils/img/calm-toy.jpeg"

export default function Collection() {

    return (
  
      <div id="collection-container">

            <h2>Our Bestsellers</h2>

            <div class="card-container">

                <div id="cards" class="row justify-content-center">

                        <div id="card-one" class="card col-10 col-lg-5">
                            <div class="card-body">
                                <img src={CalmTreatsPhoto} />
                                <h5 class="card-title">Product Title #1</h5>
                                <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                <a href="#" class="btn btn-primary">Learn More</a>
                            </div>
                        </div>

                        <div class="card col-10 col-lg-5">
                            <div class="card-body">
                                <img src={CalmToyPhoto} />
                                <h5 class="card-title">Product Title #2</h5>
                                <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                <a href="#" class="btn btn-primary">Learn More</a>
                            </div>
                        </div>

                        <a id="view-all-products-button" href="/catalog">View All Products</a>

                </div>

            </div>
  
        </div>
    );
};