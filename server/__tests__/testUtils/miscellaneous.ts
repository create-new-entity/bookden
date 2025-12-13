

import supertest from 'supertest';


// Recieve raw buffer data chunk by chunk and return the whole buffer at the end.
export const requestAsBuffer = (req: supertest.Test) => {
    return req.buffer(true).parse((res, callback) => {
        const data: Buffer[] = [];
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => callback(null, Buffer.concat(data)));
    });
};

