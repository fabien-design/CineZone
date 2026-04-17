import { jest, describe, it, expect } from '@jest/globals';
import { handleValidationErrors } from '../middlewares/handleValidationErrors.js';

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('handleValidationErrors', () => {
  it('calls next() when there are no validation errors', () => {
    const req = { body: {} };
    // validationResult reads from req — inject an empty errors array via express-validator internals
    req['express-validator#contexts'] = [];
    const res = mockRes();
    const next = jest.fn();

    handleValidationErrors(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 with errors array when validation fails', () => {
    const req = { body: {} };
    // Simulate a failed validation by injecting an error context
    req['express-validator#contexts'] = [
      {
        errors: [
          { type: 'field', msg: 'Email required', path: 'email', location: 'body', value: '' },
        ],
        getData: () => ({}),
      },
    ];
    const res = mockRes();
    const next = jest.fn();

    handleValidationErrors(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});
