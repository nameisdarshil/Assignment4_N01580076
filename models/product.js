    var mongoose = require('mongoose');
    var productSchema = new mongoose.Schema({
        asin: { type: String, required: true },
        title: { type: String, required: true },
        imgUrl: { type: String },
        stars: { type: Number },
        reviews: { type: Number },
        price: { type: Number },
        listPrice: { type: Number },
        categoryName: { type: String },
        isBestSeller: { type: String },
        boughtInLastMonth: { type: Number }
      });
    module.exports = mongoose.model('Product', productSchema);
