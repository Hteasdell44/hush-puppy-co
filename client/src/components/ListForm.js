import GenericPup from "../utils/img/generic-pup.jpeg";
export default function ListForm() {
    return (
        <div id="list-form-container">
            <h2>Join The Family!</h2>

            <form>
                <div class="form-group">
                    <label for="exampleFormControlInput1">Your Name</label>
                    <input type="text" class="form-control" id="exampleFormControlInput1" />
                </div>
                <div class="form-group">
                    <label for="exampleFormControlInput1">Your Dog's Name</label>
                    <input type="text" class="form-control" id="exampleFormControlInput1" />
                </div>
                <div class="form-group">
                    <label for="exampleFormControlInput1">Email Address</label>
                    <input type="email" class="form-control" id="exampleFormControlInput1" />
                </div>
                <button type="submit" class="btn">Submit</button>
            </form>

            <img src={GenericPup} alt="" />
            
        </div>
    );
}