import { describe, expect, it, jest } from '@jest/globals';
import { Request as ExRequest, Response as ExResponse } from 'express';
import { TimeoutError } from 'mollitia';
import { ValidateError } from 'tsoa';
import IQAirClientError from '../../../src/client/IQAirClientError';
import { errorHandler } from '../../../src/utils/error';

describe('Error handler test', () => {
  it('Should pass through when no errors', () => {
    const req = {} as unknown as ExRequest;
    const res = {} as unknown as ExResponse;
    res.status = jest.fn(() => res);
    res.json = jest.fn() as any;
    const next = jest.fn();

    errorHandler(undefined, req, res, next);
    expect(res.status).toBeCalledTimes(0);
    expect(res.json).toBeCalledTimes(0);
    expect(next).toBeCalledTimes(1);
  });

  it('Should handle validation error', () => {
    const req = {} as unknown as ExRequest;
    const res = {} as unknown as ExResponse;
    res.status = jest.fn(() => res);
    res.json = jest.fn() as any;
    const next = jest.fn();

    errorHandler(
      new ValidateError(
        {
          fields: {
            message: 'message',
          },
        },
        'validation error',
      ),
      req,
      res,
      next,
    );
    expect(res.status).toBeCalledWith(422);
    expect(res.json).toBeCalledWith({
      message: 'Validation Failed',
      details: expect.anything(),
    });
    expect(next).toBeCalledTimes(0);
  });

  it('Should handle client propagated error', () => {
    const req = {} as unknown as ExRequest;
    const res = {} as unknown as ExResponse;
    res.status = jest.fn(() => res);
    res.json = jest.fn() as any;
    const next = jest.fn();

    errorHandler(new IQAirClientError('city not found'), req, res, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: 'city not found',
    });
    expect(next).toBeCalledTimes(0);
  });

  it('Should handle timeout error', () => {
    const req = {} as unknown as ExRequest;
    const res = {} as unknown as ExResponse;
    res.status = jest.fn(() => res);
    res.json = jest.fn() as any;
    const next = jest.fn();

    errorHandler(new TimeoutError(), req, res, next);
    expect(res.status).toBeCalledWith(504);
    expect(res.json).toBeCalledWith({
      message: 'Gateway Timeout',
    });
    expect(next).toBeCalledTimes(0);
  });

  it('Should handle generic error', () => {
    const req = {} as unknown as ExRequest;
    const res = {} as unknown as ExResponse;
    res.status = jest.fn(() => res);
    res.json = jest.fn() as any;
    const next = jest.fn();

    errorHandler(new Error(), req, res, next);
    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({
      message: 'Internal Server Error',
    });
    expect(next).toBeCalledTimes(0);
  });
});
