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
                                <h5 class="card-title">Calm Treats</h5>
                                <p class="card-text">Soothe your pet's stress with Calm Treats! Crafted with natural ingredients, these tasty bites ease anxiety, promoting relaxation for a happier, healthier furry friend.</p>
                                <a href="/catalog/65e552773b710b36b592bbc4" class="btn btn-primary">Learn More</a>
                            </div>
                        </div>

                        <div class="card col-10 col-lg-5">
                            <div class="card-body">
                                <img src={CalmToyPhoto} />
                                <h5 class="card-title">The Hush Puppy</h5>
                                <p class="card-text">Ease doggy anxiety with The Hush Puppy! This plush toy mimics a heartbeat, comforting pets during separations. A cuddly solution for your pup's peace of mind.</p>
                                <a href="/catalog/65e552773b710b36b592bbc5" class="btn btn-primary">Learn More</a>
                            </div>
                        </div>

                        <a id="view-all-products-button" href="/catalog">View All Products</a>

                </div>

            </div>
  
        </div>
    );
};