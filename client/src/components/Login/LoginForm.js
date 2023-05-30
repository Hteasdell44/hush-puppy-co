export default function LoginForm() {
    
    return(

        <div id="login-container">

            <h2>Log In</h2>

            <form>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example1">Email</label>
                    <input type="email" id="form2Example1" class="form-control" />
                </div>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example2">Password</label>
                    <input type="password" id="form2Example2" class="form-control" />
                </div>

          
                <div class="row mb-4">
                    <div class="col d-flex justify-content-center">
                        <a href="#!" className="text-align-center">Forgot Your Password?</a>
                    </div>


                        
                </div>

                <button type="button" class="btn btn-primary btn-block mb-4">Sign In</button>

                <div class="text-center">
                    <p>Not a Member? <a href="/signup">Register</a></p>
                </div>

            </form>

        </div>

    );
};