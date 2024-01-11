const request = require('supertest');
const app = require('../app').app;

describe('check security headers', () => {
  test('header set check', async () => {
    const response = await request(app).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-security-policy']).toBeDefined();
    expect(response.headers['cross-origin-opener-policy']).toBeDefined();
    expect(response.headers['cross-origin-resource-policy']).toBeDefined();
    expect(response.headers['origin-agent-cluster']).toBeDefined();
    expect(response.headers['referrer-policy']).toBeDefined();
    expect(response.headers['strict-transport-security']).toBeDefined();
    expect(response.headers['x-content-type-options']).toBeDefined();
    expect(response.headers['x-dns-prefetch-control']).toBeDefined();
    expect(response.headers['x-download-options']).toBeDefined();
    expect(response.headers['x-frame-options']).toBeDefined();
    expect(response.headers['x-permitted-cross-domain-policies']).toBeDefined();
    expect(response.headers['x-powered-by']).toBeUndefined();
    // set to "0", deactivated by helmet
    expect(response.headers['x-xss-protection']).toBeDefined();
    expect(response.headers['x-xss-protection']).toBe('0');
  });
});
