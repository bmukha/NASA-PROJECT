import request from 'supertest';

import app from '../../app';
import { connectToDB, disconnectFromDB } from '../../services/mongo';
import { server } from '../../server';
beforeAll(async () => await connectToDB());
afterAll(async () => {
  await disconnectFromDB();
  server.close();
});
describe('Test GET /launches', () => {
  test('It should respond with 200 success', async () => {
    const response = await request(app).get('/launches');
    expect(response.statusCode).toBe(200);
  });
});
