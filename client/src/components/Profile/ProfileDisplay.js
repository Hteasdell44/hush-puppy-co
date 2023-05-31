import Auth from "../../utils/auth.js";

export default function ProfileDisplay() {

    if (!Auth.loggedIn()) {
        window.location.assign("/login");
    }

    const logoutUser = () => {
        Auth.logout();
    }

    const userData = Auth.getProfile();

    return(

        <div id="profile-container">
            <h2>Welcome, {userData.data.firstName} {userData.data.lastName}!</h2>

            <button onClick={logoutUser}>Sign Out</button>
        </div>

    );
};