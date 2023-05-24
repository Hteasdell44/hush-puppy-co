export default function ContactForm() {
    return(

        <div id="contact-container">
            <h2>Contact Us</h2>

            <form>
                <div class="mb-3">
                    <label for="name" class="form-label">Your Name:</label>
                    <input type="text" class="form-control"/>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Your Email:</label>
                    <input type="email" class="form-control"/>
                </div>
                <div class="mb-3">
                    <label for="exampleFormControlTextarea1" class="form-label">Message:</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                </div>
                <button type="submit" class="btn">Submit</button>
            </form>
            
        </div>
    );
}