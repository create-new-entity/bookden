import 'dotenv/config';

const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV;
const ENV_VARIABLES = {
    PORT, JWT_SECRET, NODE_ENV
};

export const isTestEnvironment = () => NODE_ENV === 'test';

export default ENV_VARIABLES;