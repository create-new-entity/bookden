import express from 'express';
import configs from './configs';

const sql = configs.pgDBPoolUtitlities.sql;

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const result = await sql`SELECT user_id, username, email FROM users;`;
        console.log('result', result);
        res.end();
    }
    catch(error) {
        console.error('Error occurred while fetching server time:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default app;