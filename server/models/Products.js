const sql = require('../db.js')

exports.getOne = (product_id) => {
  return sql`SELECT * FROM products WHERE id=${product_id}`;
};

exports.getStyle = (id) => {
  return sql`SELECT * FROM styles WHERE product_id=${id}`
  // return sql`SELECT * FROM styles JOIN skus ON styles.style_id=skus.style_id JOIN photos ON photos.style_id=styles.style_id WHERE styles.product_id=${id}`
}

exports.getFeatures = (id) => {
  return sql`SELECT * FROM features JOIN products ON features.product_id=products.id WHERE features.product_id=${id}`
}

exports.getSkus = (id) => {
  return sql`SELECT * FROM skus WHERE style_id=${id}`
}

exports.getPhotos = (id) => {
  return sql`SELECT * FROM photos WHERE style_id=${id}`
}

exports.getRelated = (id) => {
  return sql`SELECT related_id FROM related WHERE product_id=${id}`
}