import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import camelcaseKeys from 'camelcase-keys';

import { JWTSignPayload } from '../types';
import {
    AuthenticationError,
    AppError,
    errorMessages,
    errorNames
} from '../errors';
import { TOKEN_VALIDITY_SECONDS } from '../constants';
import { ENV_VARIABLES, getPGDBPool, sqlTag } from '../configs';


const getToken = ({ username, userId, userType, tokenVersion }: JWTSignPayload): string => {
    if(ENV_VARIABLES.JWT_SECRET) {
        return jwt.sign({ username, userId, userType, tokenVersion }, ENV_VARIABLES.JWT_SECRET, { expiresIn: TOKEN_VALIDITY_SECONDS });
    }
    const internalServerError = new AppError(errorMessages[errorNames.envVarUndefined], 500, false);
    throw internalServerError; // ENV_VARIABLES.JWT_SECRET is not defined.
};

const login = async (username: string, password: string): Promise<{ token: string } | undefined> => {
    const dbPool = await getPGDBPool();

    const result = await dbPool.query(sqlTag.typeAlias('User')`
        SELECT
            user_id, username, password_hash,
            user_type, email, token_version
        FROM users
        WHERE username=${username}
        AND deleted_at IS NULL;
    `);

    if(!result.rows[0]) {
        const userNotFoundError = new AuthenticationError(errorMessages[errorNames.userNotFound]);
        throw userNotFoundError;
    }

    const user = camelcaseKeys(result.rows[0], { deep: true });
    const { userId, passwordHash, userType, tokenVersion } = user;

    const isPasswordCorrect = await bcrypt.compare(password, passwordHash);
    if(isPasswordCorrect) {
        const jwtPayload = { username, userId, userType, tokenVersion };
        const token = getToken(jwtPayload);
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