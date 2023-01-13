const fs = require('fs');
const csvparse = require('csv-parse');
const parse = csvparse.parse;
const sql = require('./server/db.js')

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(`./features.csv`)
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
    await sql`INSERT INTO features (product_id, feature, value) values (${currentRecord[1]}, ${currentRecord[2]}, ${currentRecord[3]})`
  }
})();