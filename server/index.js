const express = require('express');
const app = express();
const sql = require('./db.js')
var cors = require('cors');
const productCtrl = require('./controllers/products.js');

app.use(cors());
app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());
app.use(express.static('./public'))

app.get('/products', (req, res) => {
  productCtrl.getFeatures((Math.floor(100000 * Math.random())), res);
})

app.get('/products/:productid', (req, res) => {
  var id = req.url.slice(10, req.url.length);
  productCtrl.getFeatures(id, res)
})

app.get('/products/:productid/styles', (req, res) => {
  var id = req.url.slice(10, -7);
  productCtrl.getStyle(id, res)
})

app.get('/products/:productid/related', (req, res) => {
  var id = req.url.slice(10, -8);
  productCtrl.getRelated(id, res)
})

const PORT = 8080;

app.listen(PORT);
console.log(`Server listening at port ${PORT}`)