import AuthService from "../../utils/auth.js";

export default function Footer() {

    const handleClick = () => {

        if (AuthService.loggedIn()) {

            window.location.assign('/profile');
    
        } else { window.location.assign('/login')}
    }

    return(

        <div id="footer-container">
         
            <ul>
                <li><a onClick={handleClick}>View Profile</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact Us</a></li>
            </ul>

        </div>
    );
};