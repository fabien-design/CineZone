import { jest, describe, it, expect } from '@jest/globals';
import { isAdmin } from '../middlewares/isAdmin.js';

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('isAdmin middleware', () => {
  it('calls next() when user has admin role', () => {
    const req = { userIsAdmin: 'admin' };
    const res = mockRes();
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 403 when user is not admin', () => {
    const req = { userIsAdmin: 'user' };
    const res = mockRes();
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin access required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when userIsAdmin is undefined', () => {
    const req = {};
    const res = mockRes();
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
