const fs = require('fs');
const path = require('path');
const axios = require('axios');

const books1 = require('./books_seed_data.json');
const books2 = require('./unused_seed_data.json');
const books = [...books1, ...books2];

const downloadDir = './coverImages';

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

async function downloadImage(url, bookISBN) {
  try {
    const filename = `${bookISBN}.jpg`;
    const filepath = path.join(downloadDir, filename);

    const response = await axios.get(url, { responseType: 'stream' });

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log(`✅ Saved: ${filename}`);
  } catch (err) {
    console.error(`❌ Failed: ${url}`);
    console.error(err.message);
  }
}

const DELAY = 1000;

async function downloadAll() {
  for (const book of books) {
    await downloadImage(book.image, book.isbn13);
    await new Promise(resolve => {
        console.log(`Downloaded image for ${book.title}`)
        setTimeout(resolve, DELAY);
    }); 
  }
  console.log('🎉 All images downloaded!');
}

downloadAll();
