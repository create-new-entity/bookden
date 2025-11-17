import * as db from './db';
import * as config from './config';
import * as sqlTags from './sqlTag';

export default { db, ...config, ...sqlTags };
