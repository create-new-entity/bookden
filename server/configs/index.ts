import ENV_VARIABLES from './config';
import pgDBPoolUtitlities from './db';
import { isTestEnvironment } from './config';

const configs = { ENV_VARIABLES, pgDBPoolUtitlities, isTestEnvironment };

export default configs;
