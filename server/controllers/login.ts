import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import configs from '../configs';
import { errorMessages, errorNames } from '../middlewares';

const { sqlOne } = configs.pgDBPoolUtitlities.queryVariants;


const getToken = (username: string, userId: string): string => {
    const payload = { username, userId };
    const ONE_HOUR = 60 * 60;
    if(configs.ENV_VARIABLES.JWT_SECRET) {
        return jwt.sign(payload, configs.ENV_VARIABLES.JWT_SECRET, { expiresIn: ONE_HOUR });
    }
    throw new Error('JWT secret is not defined');
};

const login = async (username: string, password: string): Promise<{ token: string } | undefined> => {
    let result;
    try {
        result = await sqlOne`
            SELECT user_id, password_hash
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

    const { userId, passwordHash } = result;
    const isPasswordCorrect = await bcrypt.compare(password, passwordHash);
    if(isPasswordCorrect) {
        const token = getToken(username, userId);
        return { token };
    }
    else {
        const invalidPasswordError = new Error(errorMessages[errorNames.invalidPassword]);
        invalidPasswordError.name = errorNames.invalidPassword;
        throw invalidPasswordError;
    }
};

export default login;