import GenericPupTwo from "../../utils/img/generic-pup-two.jpeg";
export default function Content() {
    return(
        <div id="content-container">
            <h2>About Us</h2>

            <div id="text-container">
                <p>
                Welcome to The Hush Puppy, a haven for canine companions dealing with separation anxiety. As a devoted dog owner, I understand the challenges of leaving a furry friend at home. Our community is a supportive space where we share experiences, tips, and resources to help our beloved pets cope with solitude. Together, we navigate the journey of understanding and managing separation anxiety, ensuring our dogs feel secure even when we're apart. Join us in fostering a compassionate environment for both pups and their devoted owners, because every wagging tail deserves a calm and contented heart.
                </p>
                <img src={GenericPupTwo} />
            </div>

        </div>
    );
}