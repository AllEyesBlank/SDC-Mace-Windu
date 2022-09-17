const sql = require('../server/db.js');
const axios = require('axios');

describe ('Products API tests', () => {

  it('should get products from the DB', (done) => {
    axios.get(`http://127.0.0.1:8080/products`)
      .then((data) => {
        expect.anything(data);
        done();
      })
      .catch((err) => {
        throw err;
      })
  })

  it('should get product features', (done) => {
    axios.get(`http://127.0.0.1:8080/products/${Math.round(10000 * Math.random())}`)
      .then((data) => {
        expect.anything(data);
        done();
      })
      .catch((err) => {
        throw err;
      })
  })

  it('should get product styles', (done) => {
    axios.get(`http://127.0.0.1:8080/products/${Math.round(10000 * Math.random())}/styles`)
      .then((data) => {
        expect.anything(data);
        done();
      })
      .catch((err) => {
        throw err;
      })
  })

  it('should get related products', (done) => {
    axios.get(`http://127.0.0.1:8080/products/${Math.round(10000 * Math.random())}/related`)
      .then((data) => {
        expect.anything(data);
        done();
      })
      .catch((err) => {
        throw err;
      })
  })
})