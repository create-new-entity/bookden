

export class AppError extends Error {
    public readonly statusCode: number;

    /**
        isOperational is true if the error is user induced.
        For example, bad input, user is trying to find a non-existent resource and so on.
        Let's send meaningful error messages to the user.
     */
    public readonly isOperational: boolean; 
  
    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // captureStackTrace for cleaner stack trace.
        Error.captureStackTrace(this, this.constructor);
    }
};
  