import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { SPECIFIC_BLOG_POST } from "../../utils/queries";

export default function BlogPage() {

    const { id } = useParams();
    const { data } = useQuery(SPECIFIC_BLOG_POST, {variables: { specificBlogPostId: id } });
    const blogInfo = data?.specificBlogPost || [];

    return(

        <div id="single-blog-display-container">

            <h2>{blogInfo.title}</h2>

            <h3>{blogInfo.postDate}</h3>  

            <h4>{blogInfo.author}</h4>
            <p>{blogInfo.postBody}</p>

        </div>

    );

};