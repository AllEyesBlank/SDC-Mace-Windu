const Products = require('../models/Products.js');

exports.getBeginning = (req, res) => {
  Products.getOne(66642)
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
      var result = data[0];
      result['features'] = [];
      for (let i = 0; i < data.length; i++) {
        var featureObj = {};
        featureObj['feature'] = data[i].feature;
        featureObj['value'] = data[i].value;
        result['features'].push(featureObj);
      }
      res.status(200).send(result);
    })
}

exports.getRelated = (id, res) => {
  Products.getRelated(id)
    .then((data) => {
      let result = []
      for (let i = 0; i < data.length; i++) {
        result.push(data[i].related_id);
      }
      res.status(200).send(result);
    })
}