import app from '../app';
import api from 'supertest';
import configs from '../configs';


describe('Dummy Test', () => {

    beforeAll(async () => {
        await configs.pgDBPoolUtitlities.initPGDBPool();
    });

    it('should return 200 OK for GET /api/users', async () => {
        const response = await api(app).get('/api/users');
        console.log(response.body);
        expect(response.status).toBe(200);
    });
});