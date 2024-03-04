import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth.js";
import { LOGIN } from "../../utils/mutations.js";

export default function LoginForm() {

    if (Auth.loggedIn()) {
        window.location.assign("/profile");
    }

    const [formState, setFormState] = useState({ email: "", password: "" });
    const [loginError, setLoginError] = useState("");
    const [login] = useMutation(LOGIN);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
        ...formState,
        [name]: value,
        });
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
        const mutationResponse = await login({
            variables: {
            email: formState.loginEmail.toLowerCase(),
            password: formState.loginPassword,
            },
        });
        const token = mutationResponse.data?.login?.token;
        if (token) {
            Auth.login(token);
        } else {
            console.log("Error logging in", mutationResponse.data);
        }

        } catch (err) {

        setLoginError(err.message);
        console.log(err.message);

        }
    };
    
    return(

        <div id="login-container">

            <h2>Log In</h2>

            <form onSubmit={handleLoginSubmit}>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example1">Email</label>
                    <input type="email" name="loginEmail" id="form2Example1" class="form-control" onChange={handleChange} />
                </div>

                <div class="form-outline mb-4">
                    <label class="form-label" for="form2Example2">Password</label>
                    <input type="password" name="loginPassword" id="form2Example2" class="form-control" onChange={handleChange} />
                </div>

                <button type="submit" class="btn btn-primary btn-block mb-4">Sign In</button>

                <div id="member-link" class="text-center">
                    <p>Not a Member? <a href="/signup">Register</a></p>
                    {loginError && (<div className="p-3 text-red-600">{loginError}</div>)}
                </div>

            </form>

        </div>

    );
};