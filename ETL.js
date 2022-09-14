const fs = require('fs');
const csvparse = require('csv-parse');
const parse = csvparse.parse;
const sql = require('./server/db.js')

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(`./product.csv`)
    .pipe(parse({
    // CSV options if any
    }));
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

(async () => {
  const records = await processFile();
  for (let i = 1; i < records.length; i++) {
    var currentRecord = records[i];
    await sql`INSERT INTO products (id, name, slogan, description, category) values (${parseInt(currentRecord[0])}, ${currentRecord[1]}, ${currentRecord[2]}, ${currentRecord[3]}, ${currentRecord[4]})`
  }
})();