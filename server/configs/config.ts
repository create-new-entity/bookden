import 'dotenv/config';
import { errorMessages, errorNames } from '../errors';

const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV;

if(!PORT || !JWT_SECRET || !NODE_ENV) {
    throw new Error(`${errorMessages[errorNames.envVarUndefined]}: ${PORT ? '' : 'PORT'} ${JWT_SECRET ? '' : 'JWT_SECRET'} ${NODE_ENV ? '' : 'NODE_ENV'}`);
}


export const ENV_VARIABLES = {
    PORT, JWT_SECRET, NODE_ENV
};

export const isProductionEnvironment = () => NODE_ENV === 'production';
export const isTestEnvironment = () => NODE_ENV === 'test';