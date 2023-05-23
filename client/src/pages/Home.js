import "../css/Home.css";
import Hero from "../components/Home/Hero";
import Collection from "../components/Home/Collection";
import Testimonials from "../components/Home/Testimonials";
import ListForm from "../components/Home/ListForm";

export default function Home() {

    return(
        
        <div>

            <Hero />
            <Collection />
            <Testimonials />
            <ListForm />

        </div>
        
    );
};
  