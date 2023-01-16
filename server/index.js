const express = require('express');
const app = express();
const sql = require('./db.js')
var cors = require('cors');
const productCtrl = require('./controllers/products.js');
const Rar = require('./controllers/rarController.js');
const Questions = require('./models/Questions.js');

app.use(cors());
app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());
app.use(express.static('./public'))

//PRODUCTS//

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

//QUESTIONS//

app.get('/qa/questions', (req, res) => {
  var product_id = req.query.product_id
  var page = req.query.page || 1;
  var count = req.query.count || 5;

  Questions.getQuestionData(product_id, count, page)
  .then(data => {

    res.status(200).send({
      product_id: product_id,
      results: data
    });
  })
  .catch(err => {
    res.status(500).send(err)
  })
})

app.get('/qa/questions/:question_id/answers', (req, res) => {
  var question_id = req.params.question_id;
  var page = req.query.page || 1;
  var count = req.query.count || 5;

  Questions.getAnswerData(question_id, page, count)
  .then(async (data) => {
    let answerData = await Promise.all(data.map(async (item) => {
      const result = await Questions.getAnswerPhotoData(item.answer_id)

      const test = {
        ... item,
        photos: result.map(el => {
          return {
            id: el.photo_id,
            url: el.photo_url
          }
        })
      }
      return test
    }))
    res.status(200).send({
      question: question_id,
      page: page,
      count: count,
      results: answerData
    });
  })
  .catch(err => {
    res.status(500).send(err)
  })
})

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  Questions.increaseQuestionHelpfulness(req.params.question_id)
  .then(() => {
    res.status(204).send();
  })
  .catch(err => {
    console.error(err);
    res.status(404).send(err);
  })
})

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  Questions.increaseAnswerHelpfulness(req.params.answer_id)
  .then(() => {
    res.status(204).send();
  })
  .catch(err => {
    console.error(err);
    res.status(404).send(err);
  })
})

app.put('/qa/answers/:answer_id/report', (req, res) => {
  Questions.reportAnswer(req.params.answer_id)
  .then(() => {
    res.status(204).send();
  })
  .catch(err => {
    console.error(err);
    res.status(404).send(err);
  })
})

app.post('/qa/questions/:question_id/answers', (req, res) => {
  const questionId = req.params.question_id;
  const newAnswer = {
    body: req.body.body,
    date: new Date().getTime(),
    answerer_name: req.body.name,
    answerer_email: req.body.email
  }
  Questions.addAnswer(questionId, newAnswer)
  .then(response => {
    res.status(201).send(response.data);
  })
  .catch(err => console.log(err));
})

app.post('/qa/questions', (req, res) => {
  const newQuestion = {
    product_id: req.body.product_id,
    question_body: req.body.body,
    question_date: new Date().getTime(),
    asker_name: req.body.name,
    asker_email: req.body.email
  }
  Questions.addQuestion(newQuestion)
  .then(response => {
    res.status(201).send(response.data);
  })
  .catch(err => console.log(err));
})


const PORT = 8080;

app.listen(PORT);
console.log(`Server listening at port ${PORT}`)