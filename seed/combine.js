const fs = require('fs').promises;

const output_batch1 = require('./output/output_batch1.json');
const output_batch2 = require('./output/output_batch2.json');
const output_batch3 = require('./output/output_batch3.json');
const output_batch4 = require('./output/output_batch4.json');
const output_batch5 = require('./output/output_batch5.json');
const output_batch6 = require('./output/output_batch6.json');
const output_batch7 = require('./output/output_batch7.json');
const output_batch8 = require('./output/output_batch8.json');

const output = [
    ...output_batch1, ...output_batch2, ...output_batch3, ...output_batch4,
    ...output_batch5, ...output_batch6, ...output_batch7, ...output_batch8
];

const writeAllBatches = async () => {
    try {
        await fs.writeFile(
            './output/books_seed_data.json',
            JSON.stringify(output, null, 4),
            'utf8'
        );
        console.log('All batches have been merged into combined_books.json');
    } catch (err) {
        console.error('Error writing combined file:', err);
        process.exit(1);
    }
};

writeAllBatches();