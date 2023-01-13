const fs = require('fs');
const csvparse = require('csv-parse');
const parse = csvparse.parse;
const sql = require('./server/db.js')

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(`./photos.csv`)
    .pipe(parse({
      skip_records_with_error: true
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
    await sql`INSERT INTO photos (style_id, photo_url, thumbnail) values (${currentRecord[1]}, ${currentRecord[2]}, ${currentRecord[3]})`
  }
})();