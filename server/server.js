require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const Cart = require('./models/Cart.js');

const PORT = process.env.PORT || 3001;

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

app.post('/create-checkout-session', async (req, res) => {

  let lineItemArr = [];

  const cart =  await Cart.find().sort({ _id: -1 }).populate('productIds');
  const products = cart[0].productIds;

  {products.map((item, i) => (
    lineItemArr[i] = {price: item.stripeId, quantity: item.amountInCart}
))}

  const session = await stripe.checkout.sessions.create({
    line_items: lineItemArr,
    mode: 'payment',
    success_url: `http://localhost:3000/`,
    cancel_url: `http://localhost:3000/cart`,
    automatic_tax: {enabled: true},
  });

  res.redirect(303, session.url);
});
  
startApolloServer();
  
