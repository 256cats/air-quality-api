import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Request as ExRequest, Response as ExResponse, urlencoded } from 'express';
import pino from 'pino-http';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import { Container } from 'typedi';
import { RegisterRoutes } from './generated/routes';
import { errorHandler } from './utils/error';
import { logger } from './utils/logger';
import { PRISMA_CLIENT_TOKEN } from './utils/prisma';
import { promMiddleware } from './utils/prom';

const httpLoggerMiddleware = pino({
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
    }),
  },
});

export function startMetricsServer(port: number) {
  const promApp = express();
  promApp.use(httpLoggerMiddleware);
  promApp.use('/metrics', promMiddleware.metricsMiddleware);
  return promApp.listen(port, () => {
    logger.info(`Metrics started on ${port}`);
  });
}

export function startAppServer(port: number) {
  const app = express();
  app.use(httpLoggerMiddleware);
  app.disable('x-powered-by');
  app.use(
    urlencoded({
      extended: true,
    }),
  );
  app.use(express.json({ limit: '1 MB' }));
  app.use(cookieParser());
  app.use(cors());
  app.use(promMiddleware);
  app.use('/docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
    return res.send(swaggerUi.generateHTML(await import('./generated/openapi.json')));
  });

  RegisterRoutes(app);

  app.use(function notFoundHandler(_req, res: ExResponse) {
    res.status(404).send({
      message: 'Not Found',
    });
  });

  app.use(errorHandler);

  return app.listen(port, () => {
    logger.info(`App started on ${port}`);
  });
}

export async function main() {
  Container.set(PRISMA_CLIENT_TOKEN, new PrismaClient());
  const promServer = startMetricsServer(parseInt(process.env.PROM_PORT || '9999', 10));
  const appServer = startAppServer(parseInt(process.env.SRV_PORT || '5000', 10));
  return {
    appServer,
    promServer,
  };
}
