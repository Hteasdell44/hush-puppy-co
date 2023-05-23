import PlaceholderImage from "../../utils/img/placeholder-image.png"
export default function Testimonials() {
    return (
        <div id="testimonials-container">
        
            <h2>Testimonials</h2>

            <div class="row justify-content-center">

                <div class="card">
                    <div class="card-body d-flex">
                        <img class="testimonial-pic" src={PlaceholderImage} />
                        <div class="testimonial-vertical-line"></div>
                      <p>I really enjoyed the products I ordered! This is a great company!</p>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body d-flex">
                        <img class="testimonial-pic" src={PlaceholderImage} />
                        <div class="testimonial-vertical-line"></div>
                        <p>I was satisfied with my purchase! I love this company!</p>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body d-flex">
                        <img class="testimonial-pic" src={PlaceholderImage} />
                        <div class="testimonial-vertical-line"></div>
                        <p>I definitely plan on ordering again! This company is great!</p>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body d-flex">
                        <img class="testimonial-pic" src={PlaceholderImage} />
                        <div class="testimonial-vertical-line"></div>
                        <p>I really enjoyed the fast shipping! Place an order, you wont regret it!</p>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body d-flex">
                        <img class="testimonial-pic" src={PlaceholderImage} />
                        <div class="testimonial-vertical-line"></div>
                        <p>I highly recommend this business! They're great people!</p>
                    </div>
                </div>

            </div>

        </div>
    );
};