const fs = require('fs');
const csvparse = require('csv-parse');
const parse = csvparse.parse;
const sql = require('./server/db.js')

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(`./styles.csv`)
    .pipe(parse({
    }));
  for await (const record of parser) {
    records.push(record);
  }
  return records;
};

(async () => {
  const records = await processFile();
  for (let i = 1; i < records.length; i++) {
    var currentRecord = records[i];
    let salePrice;
    let defaultStyle = 'false';
    if (currentRecord[3] === 'null') {
      salePrice = 0;
    } else {
      salePrice = currentRecord[3];
    }
    if (currentRecord[5] === 1) {
      defaultStyle = 'true';
    }
    await sql`INSERT INTO styles (product_id, style_id, style_name, original_price, sale_price, "default") values (${currentRecord[1]}, ${currentRecord[0]}, ${currentRecord[2]}, ${currentRecord[4]}, ${salePrice}, ${defaultStyle})`
  }
})();