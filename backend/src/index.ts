import 'dotenv/config';
import 'reflect-metadata';
import { Container } from 'typedi';
import { main } from './server';
import { logger } from './utils/logger';
import { PRISMA_CLIENT_TOKEN } from './utils/prisma';

export async function halt(e: Error) {
  logger.error(e);
  await Container.get(PRISMA_CLIENT_TOKEN)?.$disconnect();
  process.exit(1);
}

process.on('exit', async function () {
  await Container.get(PRISMA_CLIENT_TOKEN)?.$disconnect();
});

process.on('uncaughtException', halt);
process.on('unhandledRejection', halt);
process.on('SIGINT', halt);
process.on('SIGUSR1', halt);
process.on('SIGUSR2', halt);

main().catch(halt);
