import Logo from "../../utils/img/thpc-logo.png";
import ShoppingCartIcon from "../../utils/img/shopping-cart-icon.png";
import ProfileIcon from "../../utils/img/profile-icon.png";

export default function Nav() {


    return (

        <header>

                <nav id="nav-bar" class="navbar navbar-expand-lg navbar-light bg-white">

                    <div class="container-fluid">

                        <button class="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#navbarExample01" aria-controls="navbarExample01" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                            <i class="fas fa-bars"></i>
                        </button>

                        <div class="collapse navbar-collapse" id="navbarExample01">

                            <ul class="navbar-nav me-auto mb-200 mb-lg-0">

                                <li class="nav-item active">
                                    <a class="nav-link" aria-current="page" href="#">Shop</a>
                                </li>

                                <li class="nav-item">
                                    <a class="nav-link" href="#">Blog</a>
                                </li>

                                <li class="nav-item">
                                    <a class="nav-link" href="/about">About</a>
                                </li>

                                <li class="nav-item">
                                    <a class="nav-link" href="#">Contact Us</a>
                                </li>

                            </ul>

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