import { useQuery } from "@apollo/client";
import { ALL_BLOG_POSTS } from "../../utils/queries";

export default function BlogDisplay() {

    const { data } =  useQuery(ALL_BLOG_POSTS);
    const blogList = data?.allBlogPosts || [];
    console.log(blogList)

    return(

        <div id="blog-display-container">

            <h2>The Hush Puppy Blog</h2>
            
            <div id="product-card-container" className="d-flex flex-row flex-wrap">

                {blogList && blogList.map((blog) => (

                    <a className="col-10 col-md-10 col-xl-10 col-lg-10 blog-card">

                        <div key={blog._id}>

                            <div className="mb-3 blog-info">
                        
                                <h4 id="card-header" className="text-light p-2 m-0">{blog.title}</h4>
                                <h4>Posted By:</h4>

                                <h4>{blog.author}</h4>
                                <h4>{blog.postDate}</h4>
                            
                        
                            </div>

                        </div>

                    </a>
                ))}

            </div>

        </div>
    );
};