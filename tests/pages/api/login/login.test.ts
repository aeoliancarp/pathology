import { testApiHandler } from 'next-test-api-route-handler';
import { Logger } from 'winston';
import { logger } from '../../../../helpers/logger';
import { dbDisconnect } from '../../../../lib/dbConnect';
import handler from '../../../../pages/api/login/index';

afterAll(async() => {
  await dbDisconnect();
});
afterEach(() => {
  jest.restoreAllMocks();
});
describe('pages/api/login/index.ts', () => {
  jest.spyOn(logger, 'error').mockImplementation(() => ({} as Logger));
  test('Sending nothing should return 405', async () => {
    await testApiHandler({
      handler: handler,
      test: async ({ fetch }) => {
        const res = await fetch();
        const response = await res.json();

        expect(response.error).toBe('Method not allowed');
        expect(res.status).toBe(405);
      }
    });
  });
  test('Sending blank creds should return 401', async () => {
    jest.spyOn(logger, 'error').mockImplementation(() => ({} as Logger));
    await testApiHandler({
      handler: handler,
      requestPatcher: (req) => {
        req.headers = { key: process.env.SPECIAL_TOKEN };
        req.method = 'POST';
      },
      test: async ({ fetch }) => {
        const res = await fetch();
        const response = await res.json();

        expect(response.error).toBe('Bad request');
        expect(res.status).toBe(400);
      }
    });
  });
  test('Sending incorrect username should return 401', async () => {
    const credsJSON = { name: 'awiejgpewajigo', password: 'BAD' };

    await testApiHandler({
      handler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          body: JSON.stringify(credsJSON),
          headers: {
            'content-type': 'application/json' // Must use correct content type
          },
        });
        const response = await res.json();

        expect(response.error).toBe('Incorrect email or password');
        expect(res.status).toBe(401);
      }
    });
  });
  test('Sending incorrect password should return 401', async () => {
    const credsJSON = { name: 'test', password: 'BAD' };

    await testApiHandler({
      handler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          body: JSON.stringify(credsJSON),
          headers: {
            'content-type': 'application/json' // Must use correct content type
          },
        });
        const response = await res.json();

        expect(response.error).toBe('Incorrect email or password');
        expect(res.status).toBe(401);
      }
    });
  });
  test('Sending correct creds should return 200', async () => {
    const credsJSON = { name: 'test', password: 'test' };

    await testApiHandler({
      handler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          body: JSON.stringify(credsJSON),
          headers: {
            'content-type': 'application/json' // Must use correct content type
          }
        });
        const response = await res.json();

        expect(response.success).toBe(true);
        expect(res.status).toBe(200);
      }
    });
  });
  test('Sending correct email creds should return 200', async () => {
    const credsJSON = { name: 'test@gmail.com', password: 'test' };

    await testApiHandler({
      handler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          body: JSON.stringify(credsJSON),
          headers: {
            'content-type': 'application/json' // Must use correct content type
          }
        });
        const response = await res.json();

        expect(response.success).toBe(true);
        expect(res.status).toBe(200);
      }
    });
  });
});
