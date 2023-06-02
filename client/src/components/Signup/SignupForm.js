import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth.js";
import { CREATE_USER } from "../../utils/mutations.js";

export default function SignupForm(){

    if (Auth.loggedIn()) {
        window.location.assign("/profile");
      }
      const [formState, setFormState] = useState({ firstName: "", lastName: "", email: "", password: "", passwordConfirm: "" });
      const [signupError, setSignupError] = useState("");
      const [createUser] = useMutation(CREATE_USER);
    
      const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
          ...formState,
          [name]: value,
        });
      };
    
      const handleSignupSubmit = async (event) => {
        event.preventDefault();
        try {

          console.log(formState.password);
          console.log(formState.passwordConfirm);

          if (formState.password !== formState.passwordConfirm) {
            setSignupError("Passwords do not match!");
            return;
          }

          const mutationResponse = await createUser({
            variables: {
              firstName: formState.firstName,
              lastName: formState.lastName,
              email: formState.email.toLowerCase(),
              password: formState.password,
            },
          });

          const token = mutationResponse.data?.createUser?.token;

          if (token) {
            Auth.login(token);
            window.location.assign("/profile");
            
          } else {
            console.log("Error creating an account", mutationResponse.data);
          }
        } catch (err) {
          setSignupError(err.message);
          console.log(err.message);
        }
      };

    return(

        <div id="signup-container">
            <h2>Sign Up</h2>

            <form onSubmit={handleSignupSubmit}>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example1">First Name</label>
                    <input type="text" name="firstName" class="form-control" onChange={handleChange}/>
                </div>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example1">Last Name</label>
                    <input type="text" name="lastName" class="form-control" onChange={handleChange}/>
                </div>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example1">Email</label>
                    <input type="email" name="email" class="form-control" onChange={handleChange}/>
                </div>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example2">Password</label>
                    <input type="password" name="password" class="form-control" onChange={handleChange}/>
                </div>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example2">Confirm Password</label>
                    <input type="password" name="passwordConfirm" class="form-control" onChange={handleChange}/>
                </div>

                <button type="submit" class="btn btn-primary btn-block mb-4">Sign Up</button>

                <div class="text-center">
                    <p>Already a Member? <a href="/login">Login</a></p>
                    {signupError && (<div className="p-3 text-red-600">{signupError}</div>)}
                </div>

            </form>

        </div>
    );


};