const pool = require('../rar_db.js');

const rarModel = {

  getReviewsByID: function(id) {
    return pool.query(
    `SELECT json_build_object(
        'product', ${id},
        'results',
        (SELECT json_agg(json_build_object(
          'review_id', review_id,
          'rating', rating,
          'summary', summary,
          'recommend', recommend,
          'response', response,
          'body', body,
          'date', date,
          'helpfulness', helpfulness,
          'photos',
          (SELECT json_agg(json_build_object(
            'id', Photos.image_id,
            'url', Photos.url))
          FROM Photos
          WHERE Photos.review_id = Reviews.review_id)
          ))
        FROM Reviews
        WHERE Reviews.product_id = ${id}
      )
  );`
      )
  },
  getReviewsByMetric: function(productAndMetric) {
    // sort database entries that are acquired (like above) by helpfulness, date, and relevance
   return pool.query(`SELECT * FROM Reviews WHERE product_id = 66642 ORDER BY helpfulness DESC`);
  },
  getMetaData: function(id) {
    return pool.query(
      `SELECT json_build_object(
          'product_id', ${id},
          'ratings', json_build_object(
            '1', (SELECT COUNT(*) FROM Reviews WHERE rating = 1 AND product_id = ${id}),
            '2', (SELECT COUNT(*) FROM Reviews WHERE rating = 2 AND product_id = ${id}),
            '3', (SELECT COUNT(*) FROM Reviews WHERE rating = 3 AND product_id = ${id}),
            '4', (SELECT COUNT(*) FROM Reviews WHERE rating = 4 AND product_id = ${id}),
            '5', (SELECT COUNT(*) FROM Reviews WHERE rating = 5 AND product_id = ${id})
            ),
          'recommended', json_build_object(
            '0', (SELECT COUNT(*) FROM reviews WHERE recommend = '0' AND product_id = ${id}),
            '1', (SELECT COUNT(*) FROM reviews WHERE recommend = '1' AND product_id = ${id})
            ),
          'characteristics', json_build_object(
            'Size', json_build_object(
                'id', (SELECT characteristic_id FROM Characteristics WHERE name = 'Size' AND product_id = ${id}),
                'value', (SELECT AVG(value) FROM Characteristics_Reviews JOIN Characteristics ON Characteristics_Reviews.characteristic_id = Characteristics.characteristic_id WHERE product_id = ${id} AND name = 'Size')
            ),
            'Width', json_build_object(
              'id', (SELECT characteristic_id FROM Characteristics WHERE name = 'Width' AND product_id = ${id}),
              'value', (SELECT AVG(value) FROM Characteristics_Reviews JOIN Characteristics ON Characteristics_Reviews.characteristic_id = Characteristics.characteristic_id WHERE product_id = ${id} AND name = 'Width')
            ),
            'Comfort', json_build_object(
              'id', (SELECT characteristic_id FROM Characteristics WHERE name = 'Comfort' AND product_id = ${id}),
              'value', (SELECT AVG(value) FROM Characteristics_Reviews JOIN Characteristics ON Characteristics_Reviews.characteristic_id = Characteristics.characteristic_id WHERE product_id = ${id} AND name = 'Comfort')
            ),
            'Length', json_build_object(
              'id', (SELECT characteristic_id FROM Characteristics WHERE name = 'Length' AND product_id = ${id}),
              'value', (SELECT AVG(value) FROM Characteristics_Reviews JOIN Characteristics ON Characteristics_Reviews.characteristic_id = Characteristics.characteristic_id WHERE product_id = ${id} AND name = 'Length')
            ),
            'Fit', json_build_object(
              'id', (SELECT characteristic_id FROM Characteristics WHERE name = 'Fit' AND product_id = ${id}),
              'value', (SELECT AVG(value) FROM Characteristics_Reviews JOIN Characteristics ON Characteristics_Reviews.characteristic_id = Characteristics.characteristic_id WHERE product_id = ${id} AND name = 'Fit')
            ),
            'Quality', json_build_object(
              'id', (SELECT characteristic_id FROM Characteristics WHERE name = 'Quality' AND product_id = ${id}),
              'value', (SELECT AVG(value) FROM Characteristics_Reviews JOIN Characteristics ON Characteristics_Reviews.characteristic_id = Characteristics.characteristic_id WHERE product_id = ${id} AND name = 'Quality')
            )
          )
      );`
    );
  },
  markAsHelpful: function(id) {
    return; // client.query(``)
  },
  addReview: function(review) {
    let dateToAdd = new Date();
    let params = [
      review.product_id, // 1
      review.rating, // 2
      review.summary, // 3
      review.recommend, // 4
      review.response, // 5
      review.body, // 6
      dateToAdd, // 7
      0, // 8
      // review.photos, // 8
    ];
    let text = `INSERT INTO Reviews (product_id, rating, summary, recommend, response, body, date, helpfulness) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
    return pool.query(text, params);
  },
  reportReview: function(id) {
    return; // client.query(``)
  },
}

module.exports = rarModel;