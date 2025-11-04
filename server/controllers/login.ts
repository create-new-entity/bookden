import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import configs from '../configs';
import { errorMessages, errorNames } from '../middlewares';
import { JWTSignPayload } from '../types/Authentication';
import { UserTypes } from '../types';

const { sqlOne } = configs.pgDBPoolUtitlities.queryVariants;

const TOKEN_VALIDITY_SECONDS = 24 * 60 * 60; // 24 hours in seconds

const getToken = ({ username, userId, userType }: JWTSignPayload): string => {
    if(configs.ENV_VARIABLES.JWT_SECRET) {
        return jwt.sign({ username, userId, userType }, configs.ENV_VARIABLES.JWT_SECRET, { expiresIn: TOKEN_VALIDITY_SECONDS });
    }
    const internalServerError = new Error(errorMessages[errorNames.internalServerError]);
    internalServerError.name = errorNames.internalServerError;
    throw internalServerError; // configs.ENV_VARIABLES.JWT_SECRET is not defined.
};

const login = async (username: string, password: string): Promise<{ token: string, userType: UserTypes } | undefined> => {
    let result;
    try {
        result = await sqlOne`
            SELECT user_id, password_hash, user_type
            FROM users
            WHERE username=${username}
        `;
    }
    catch(error) {
        if(error instanceof Error) {
            const userNotFoundError = new Error(errorMessages[errorNames.userNotFound]);
            userNotFoundError.name = errorNames.userNotFound;
            throw userNotFoundError;
        }
    }

    const { userId, passwordHash, userType } = result;
    const isPasswordCorrect = await bcrypt.compare(password, passwordHash);
    if(isPasswordCorrect) {
        const token = getToken({ username, userId, userType });
        return { token, userType };
    }
    else {
        const invalidPasswordError = new Error(errorMessages[errorNames.invalidPassword]);
        invalidPasswordError.name = errorNames.invalidPassword;
        throw invalidPasswordError;
    }
};

export default login;