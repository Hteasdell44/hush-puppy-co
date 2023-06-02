import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth.js";
import { UPDATE_USER } from "../../utils/mutations.js";

export default function ProfileDisplay() {

    const userData = Auth.getProfile();
    console.log(userData);

    if (!Auth.loggedIn()) {
        window.location.assign("/login");
    }

    const logoutUser = () => {
        Auth.logout();
    }

    const [formState, setFormState] = useState({ firstName: "", lastName: "", email: ""});
    
      const [updateUser] = useMutation(UPDATE_USER);
    
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

          const mutationResponse = await updateUser({
            variables: {
              userId: userData.data._id,
              firstName: formState.firstName,
              lastName: formState.lastName,
              email: formState.email.toLowerCase(),
            },
          });

          logoutUser();   
            
        } catch (err) {
          
          console.log(err.message);
        }
      };

    

    return(

        <div id="profile-container">
            <h2>Welcome, {userData.data.firstName} {userData.data.lastName}!</h2>

            <div>
                <h3>Update My Profile</h3>

                <form onSubmit={handleSignupSubmit}>

                    
                        <label class="form-label" for="form2Example1">First Name</label>
                        <input placeholder={userData.data.firstName} type="text" name="firstName" class="form-control mb-4" onChange={handleChange}/>
                    
                        <label class="form-label" for="form2Example1">Last Name</label>
                        <input placeholder={userData.data.lastName} type="text" name="lastName" class="form-control mb-4" onChange={handleChange}/>
                

                        <label class="form-label" for="form2Example1">Email</label>
                        <input placeholder={userData.data.email} type="email" name="email" class="form-control mb-4" onChange={handleChange}/>

                    <button type="submit" class="btn btn-primary bg-white btn-block mb-4">Update</button>
                    <p>You will need to login again once you update your info!</p>

                </form>
    
            </div>
            <div>
                <h3>Sign Out</h3>
                <button onClick={logoutUser}>Sign Out</button>
            </div>

            
        </div>

    );
};