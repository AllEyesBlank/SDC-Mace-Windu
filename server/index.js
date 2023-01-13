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

//REVIEWS//

app.get('/reviews/:productID', (req, res) => {
  let selectedProduct = req.params;
  Rar.getReviews(selectedProduct)
    .then((results) => res.status(200).send(results.rows[0].json_build_object)) //
    .catch((error) => res.send(error))
});

app.get('/sortReviews/:productID/:sortType', (req, res) => {

  let selectedProduct = req.params;
  Rar.getSortedReviews(selectedProduct)
    .then((reviews) => res.status(200).send(reviews))
    .catch((error) => res.end(error));
});

app.get('/reviews/meta/:productID', (req, res) => {

  let selectedProduct = req.params;
  Rar.getMeta(selectedProduct)
    .then((metadata) => res.status(200).send(metadata.rows))
    .catch((error) => res.send(error));
});

app.post('/addReview', (req, res) => {

  let newReview = req.body;
  Rar.addNewReview(newReview)
    .then((results) => res.status(201).send('Review Added'))
    .catch((error) => res.send(error));
});

app.put(`/reviews/helpful`, (req, res) => {

  let productToPromote = req.body;
  Rar.logHelpfulReview(productToPromote)
    .then((results) => console.log('DB sent back incremented helpful counter in this format:', results))
    .catch((error) => console.log(error));
});

app.put('/reviews/report', (req, res) => {

  let productToReport = req.body;
  Rar.reportReview(productToReport)
    .then((results) => console.log('DB sent back reported review confirmation in this format:', results))
    .catch((error) => console.log(error));
});


const PORT = 8080;

app.listen(PORT);
console.log(`Server listening at port ${PORT}`)