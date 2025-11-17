import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import camelcaseKeys from 'camelcase-keys';

import configs from '../configs';
import { JWTSignPayload } from '../types';
import {
    AuthenticationError,
    AppError,
    errorMessages,
    errorNames
} from '../errors';
import { TOKEN_VALIDITY_SECONDS } from '../constants';
import { getPGDBPool } from '../configs/db';
import { sqlTag } from '../configs/sqlTag';


const getToken = ({ username, userId, userType }: JWTSignPayload): string => {
    if(configs.ENV_VARIABLES.JWT_SECRET) {
        return jwt.sign({ username, userId, userType }, configs.ENV_VARIABLES.JWT_SECRET, { expiresIn: TOKEN_VALIDITY_SECONDS });
    }
    const internalServerError = new AppError(errorMessages[errorNames.envVarUndefined], 500, false);
    throw internalServerError; // configs.ENV_VARIABLES.JWT_SECRET is not defined.
};

const login = async (username: string, password: string): Promise<{ token: string } | undefined> => {
    const dbPool = await getPGDBPool();

    const result = await dbPool.query(sqlTag.typeAlias('User')`
        SELECT user_id, username, password_hash, user_type, email
        FROM users
        WHERE username=${username}
    `);

    const user = camelcaseKeys(result.rows[0], { deep: true });
    const { userId, passwordHash, userType } = user;

    const isPasswordCorrect = await bcrypt.compare(password, passwordHash);
    if(isPasswordCorrect) {
        const token = getToken({ username, userId, userType });
        return { token };
    }
    else {
        const invalidPasswordError = new AuthenticationError(errorMessages[errorNames.invalidPassword]);
        throw invalidPasswordError;
    }
};

export {
    login
};