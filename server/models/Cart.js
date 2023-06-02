const { Schema, model } = require('mongoose');

const cartSchema = new Schema({

    productIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
    ],

});

cartSchema.virtual('productCount').get(() => {
    return this.products.length;
});

const Cart = model('Cart', cartSchema);

module.exports = Cart;