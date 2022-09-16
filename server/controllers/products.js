const Products = require('../models/Products.js');

exports.getBeginning = (req, res) => {
  Products.getOne(3)
    .then((data) => {
      res.status(200).send(data);
    });
}

exports.getStyle = (id, res) => {
  var response = {};
  return Products.getStyle(id)
    .then((data) => {
      response['results'] = data;
      var result = [];
      for (let i = 0; i < response['results'].length; i++) {
        result.push(Products.getSkus(response['results'][i].style_id));
      }
      return Promise.all(result);
    })
    .then((skus) => {
      var result = [];
      for (let i = 0; i < skus.length; i++) {
        response.results[i]['skus'] = skus[i];
        result.push(Products.getPhotos(response.results[i].style_id))
      }
      return Promise.all(result);
    })
    .then((photos) => {
      for (let i = 0; i < photos.length; i++) {
        response.results[i]['photos'] = photos[i]
      }
      res.status(200).send(response);
    })
}

exports.getFeatures = (id, res) => {
  Products.getFeatures(id)
    .then((data) => {
      console.log('features data: ', data);
      res.status(200).send(data);
    })
}

exports.getRelated = (id, res) => {
  console.log('id related: ', id);
  Products.getRelated(id)
    .then((data) => {
      let result = []
      console.log('data: ', data)
      for (let i = 0; i < data.length; i++) {
        result.push(data[i].related_id);
      }
      console.log('result: ', result)
      res.status(200).send(result);
    })
}