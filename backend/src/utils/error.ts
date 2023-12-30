import { Request as ExRequest, Response as ExResponse, NextFunction } from 'express';
import { TimeoutError } from 'mollitia';
import { ValidateError } from 'tsoa';
import ClientPropagatedError from '../error/ClientPropagatedError';
import { logger } from './logger';

export function errorHandler(err: unknown, req: ExRequest, res: ExResponse, next: NextFunction): ExResponse | void {
  if (err instanceof ValidateError) {
    logger.error(`Caught Validation Error for ${req.path}`);
    logger.error(err.fields);
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields,
    });
  }

  if (err instanceof ClientPropagatedError) {
    logger.error(err);
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err instanceof TimeoutError) {
    logger.error(err);
    return res.status(504).json({
      message: 'Gateway Timeout',
    });
  }

  if (err instanceof Error) {
    logger.error(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }

  next();
}
