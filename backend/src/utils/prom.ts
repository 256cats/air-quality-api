import promBundle from 'express-prom-bundle';

export const promMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  autoregister: false,
  promClient: {
    collectDefaultMetrics: {},
  },
});
