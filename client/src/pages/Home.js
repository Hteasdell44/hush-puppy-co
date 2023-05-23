import "../css/Home.css";
import Nav from "../components/Nav"
import Hero from "../components/Hero";
import Collection from "../components/Collection";
import Testimonials from "../components/Testimonials";
import ListForm from "../components/ListForm";
import Footer from "../components/Footer";

export default function Home() {

    return(
        
        <div>

            <Nav />
            <Hero />
            <Collection />
            <Testimonials />
            <ListForm />
            <Footer />

        </div>
        
    );
};
  