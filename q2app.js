var express  = require('express');
var path = require('path');
var app      = express();
const exphbs = require('express-handlebars');
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var mongoose = require('mongoose');

var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, 'public')));

mongoose.set('strictQuery', false)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.engine('.hbs', exphbs.engine({ extname:'.hbs' }));
app.set('view engine', '.hbs');

mongoose.connect(database.url)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
  
  
app.get('/api/productsnew', async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('partials/products', { products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

var Product = require('./models/product');

app.get('/api/products', async (req, res) => {
	try {
	  const products = await Product.find();
	  res.json(products);
	} catch (err) {
	  res.status(500).json({ message: err.message });
	}
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.asin });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

  app.post('/api/products', async (req, res) => {
	const product = new Product(req.body);
	
	try {
	  const newProduct = await product.save();
	  res.status(201).json(newProduct);
	} catch (err) {
	  res.status(400).json({ message: err.message });
	}
  });

  app.delete('/api/products/:id', getProduct, async (req, res) => {
	try {
	  await res.product.remove();
	  res.json({ message: 'Product deleted' });
	} catch (err) {
	  res.status(500).json({ message: err.message });
	}
  });

  async function getProduct(req, res, next) {
	let product;
	try {
	  product = await Product.findOne({ $or: [{ asin: req.params.id }, { _id: req.params.id }] });
	  if (product == null) {
		return res.status(404).json({ message: 'Cannot find product' });
	  }
	} catch (err) {
	  return res.status(500).json({ message: err.message });
	}
	res.product = product;
	next();
  }
  
  app.listen(port, () => console.log(`App listening on port ${port}`));
