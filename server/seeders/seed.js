const db = require('../config/connection');
const { User, Product, BlogPost, Cart } = require('../models');

const userData = require('./data/userData.json');
const productData = require('./data/productData.json');
const blogData = require('./data/blogData.json');

db.once('open', async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Cart.deleteMany({});
  await BlogPost.deleteMany({});

  await User.insertMany(userData);
  await Product.insertMany(productData);
  await BlogPost.insertMany(blogData);



  console.log('The Hush Puppy Company Database Has Been Seeded 🌱!');
  process.exit(0);
});