export default function SignupForm(){

    return(

        <div id="signup-container">
            <h2>Sign Up</h2>

            <form>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example1">Email</label>
                    <input type="email" id="form2Example1" class="form-control" />
                </div>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example2">Password</label>
                    <input type="password" id="form2Example2" class="form-control" />
                </div>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example2">Confirm Password</label>
                    <input type="password" id="form2Example2" class="form-control" />
                </div>

                <button type="button" class="btn btn-primary btn-block mb-4">Sign Up</button>

                <div class="text-center">
                    <p>Already a Member? <a href="/login">Login</a></p>
                </div>

            </form>

        </div>
    );


};