import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import configs from '../configs';
import { JWTSignPayload, UserTypes } from '../types';
import {
    AuthenticationError,
    AppError,
    errorMessages,
    errorNames
} from '../errors';

const { sqlOne } = configs.pgDBPoolUtitlities.queryVariants;

const TOKEN_VALIDITY_SECONDS = 24 * 60 * 60; // 24 hours in seconds

const getToken = ({ username, userId, userType }: JWTSignPayload): string => {
    if(configs.ENV_VARIABLES.JWT_SECRET) {
        return jwt.sign({ username, userId, userType }, configs.ENV_VARIABLES.JWT_SECRET, { expiresIn: TOKEN_VALIDITY_SECONDS });
    }
    const internalServerError = new AppError(errorMessages[errorNames.envVarUndefined], 500, false);
    throw internalServerError; // configs.ENV_VARIABLES.JWT_SECRET is not defined.
};

const login = async (username: string, password: string): Promise<{ token: string, userType: UserTypes } | undefined> => {

    const result = await sqlOne`
        SELECT user_id, password_hash, user_type
        FROM users
        WHERE username=${username}
    `;

    const { userId, passwordHash, userType } = result;
    const isPasswordCorrect = await bcrypt.compare(password, passwordHash);
    if(isPasswordCorrect) {
        const token = getToken({ username, userId, userType });
        return { token, userType };
    }
    else {
        const invalidPasswordError = new AuthenticationError(errorMessages[errorNames.invalidPassword]);
        throw invalidPasswordError;
    }
};

export {
    login
};