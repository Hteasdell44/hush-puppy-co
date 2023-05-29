import Logo from "../../utils/img/thpc-logo.png";
import ShoppingCartIcon from "../../utils/img/shopping-cart-icon.png";
import ProfileIcon from "../../utils/img/profile-icon.png";

export default function Nav() {


    return (
        <header>

                <nav id="nav-bar" class="navbar navbar-expand-md navbar-light bg-white">

                    <div class="container-fluid">

                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-links" aria-controls="navbarExample01" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                            <i class="fas fa-bars"></i>
                        </button>


                        <div id="nav-links-container">

                            <div class="collapse navbar-collapse" id="navbar-links">

                                <ul class="navbar-nav">

                                    <li class="nav-item active">
                                        <a class="nav-link" aria-current="page" href="/">Home</a>
                                    </li>

                                    <li class="nav-item active">
                                        <a class="nav-link" aria-current="page" href="/catalog">Shop</a>
                                    </li>

                                    <li class="nav-item">
                                        <a class="nav-link" href="/blog">Blog</a>
                                    </li>

                                    <li class="nav-item">
                                        <a class="nav-link" href="/about">About</a>
                                    </li>

                                    <li class="nav-item">
                                        <a class="nav-link" href="/contact">Contact Us</a>
                                    </li>

                                    <li class="nav-item" id="profile-link">
                                        <a class="nav-link" href="/profile">Login</a>
                                    </li>

                                </ul>

                            </div>
                        </div>

                        <a id="logo-link" href="/">
                            <img id="logo" src={Logo} class="img-fluid" alt="Responsive image" />
                        </a>
                        
                        <ul class="nav navbar-nav navbar-right">
                            <li class="dropdown">
                                <a href="#">
                                    <img id="profile-icon" src={ProfileIcon}/>
                                </a>

                                <a id="shopping-cart-button" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"> 
                                    <img id="shopping-cart-icon" src={ShoppingCartIcon}/>
                                </a>
                            </li>
                        </ul>
                        
                    </div>

                </nav>

        </header>

    );

}