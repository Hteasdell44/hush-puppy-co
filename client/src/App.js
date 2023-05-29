import React from "react";
import Home from "./pages/Home";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import "./css/App.css";

import Nav from "./components/Reused/Nav";
import Footer from "./components/Reused/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Catalog from "./pages/Catalog";
import Blog from "./pages/Blog";
import Product from "./pages/Product";

document.title = "Hush Puppy Co.";

const httpLink = createHttpLink({uri: '/graphql'});

const authLink = setContext((_, { headers }) => {
    
    const token = localStorage.getItem('id_token');
   
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
});
  
const client = new ApolloClient({
  
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

const App = () => {
    return(

        <div>

            <Nav />

            <ApolloProvider client={client}>
                <Router>
                    <Routes>

                        <Route path="/" element={<Home />} />
                        
                        <Route path="/about" element={<About />} />

                        <Route path="/contact" element={<Contact />} />

                        <Route path="/catalog" element={<Catalog />} />

                        <Route path="/catalog/:id" element={<Product />}/>                        

                        <Route path="/blog" element={<Blog />} />

                    </Routes>
                </Router>
            </ApolloProvider>

            <Footer />

        </div>
    );
};


export default App;