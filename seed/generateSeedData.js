
const axios = require('axios');
const fs = require('fs').promises;

const batch1 = require('./batch1_books.json');
const batch2 = require('./batch2_books.json');
const batch3 = require('./batch3_books.json');
const batch4 = require('./batch4_books.json');
const batch5 = require('./batch5_books.json');
const batch6 = require('./batch6_books.json');
const batch7 = require('./batch7_books.json');
const batch8 = require('./batch8_books.json');
const batch9 = require('./batch9_books.json');

const getEndpointUrl = (title) => {
    return `https://api2.isbndb.com/books/${title}?page=1&pageSize=10&column=title&shouldMatchAll=1`
}

const booksToDownload = [
    // ...batch1,
    // ...batch2,
    // ...batch3,
    // ...batch4,
    // ...batch5,
    // ...batch6,
    // ...batch7,
    // ...batch8,
    // ...batch9
];

const writeJSON = async (bookDetails) => {
  try {
    const jsonString = JSON.stringify(bookDetails, null, 2);
    await fs.writeFile('output_batch9.json', jsonString, 'utf8');
    console.log("JSON file has been saved.");
  } catch (err) {
    console.log("Error writing file:", err);
  }
}

const getBookDetails = async () => {
    const books = []
    const headers = {
        'Authorization': '65026_24136b055443de85928429d57096aceb',
        'Accept': 'application/json'
    }
    for await (const book of booksToDownload) {
        const url = getEndpointUrl(book.title);
        try {
            console.log('Trying to get', book.title)
            const res = await axios.get(url, { headers });
            if(res.data && res.data.books && res.data.books[0]) {
                books.push(res.data.books[0]);
            }
            else {
                console.log('Not found: ', book.title);
            }
        }
        catch(e) {
            console.log('e', e);
            process.exit(1);
        }
    }
    return books;
}

const downloadBookDetails = async () => {
    const bookDetails = await getBookDetails();
    await writeJSON(bookDetails);
};

downloadBookDetails();