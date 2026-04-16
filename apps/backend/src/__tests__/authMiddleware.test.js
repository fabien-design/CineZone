import { jest, describe, it, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';

// Set env vars before importing middleware (auth.config.js reads from process.env)
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

const { authenticateUser, refreshTokenValidation } = await import('../middlewares/authMiddleware.js');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('authenticateUser middleware', () => {
  it('returns 401 when no access token cookie', async () => {
    const req = { cookies: {} };
    const res = mockRes();
    const next = jest.fn();

    await authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('sets req.userId and calls next() with a valid token', async () => {
    const token = jwt.sign({ id: 42, role: 'user' }, 'test-secret', { expiresIn: '1h' });
    const req = { cookies: { accessToken: token } };
    const res = mockRes();
    const next = jest.fn();

    await authenticateUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe(42);
    expect(req.userIsAdmin).toBe('user');
  });

  it('returns 401 with an expired token', async () => {
    const token = jwt.sign({ id: 1, role: 'user' }, 'test-secret', { expiresIn: '-1s' });
    const req = { cookies: { accessToken: token } };
    const res = mockRes();
    const next = jest.fn();

    await authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 with a token signed with the wrong secret', async () => {
    const token = jwt.sign({ id: 1 }, 'wrong-secret');
    const req = { cookies: { accessToken: token } };
    const res = mockRes();
    const next = jest.fn();

    await authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('refreshTokenValidation middleware', () => {
  it('returns 401 when no refresh token cookie', async () => {
    const req = { cookies: {} };
    const res = mockRes();
    const next = jest.fn();

    await refreshTokenValidation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('sets req.userId and calls next() with a valid refresh token', async () => {
    const token = jwt.sign({ id: 7, role: 'admin' }, 'test-refresh-secret', { expiresIn: '7d' });
    const req = { cookies: { refreshToken: token } };
    const res = mockRes();
    const next = jest.fn();

    await refreshTokenValidation(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe(7);
    expect(req.userIsAdmin).toBe('admin');
  });
});
