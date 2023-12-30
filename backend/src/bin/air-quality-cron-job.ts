import { PrismaClient } from '@prisma/client';
import { Command } from 'commander';
import 'dotenv/config';
import cron from 'node-cron';
import 'reflect-metadata';
import { Container } from 'typedi';
import { AirQualityService } from '../service/AirQualityService';
import { logger } from '../utils/logger';
import { PRISMA_CLIENT_TOKEN } from '../utils/prisma';

function halt(e: unknown) {
  console.error(e);
  process.exit(1);
}

const program = new Command();
program
  .name('air-quality-job')
  .description('Loads air quality data for given lat/lon')
  .version('0.0.1')
  .requiredOption('-lat, --lat <float>', '--lat latitude')
  .requiredOption('-lon, --lon <float>', '--lon longitude');

program.parse();
const options = program.opts();

Container.set(PRISMA_CLIENT_TOKEN, new PrismaClient());
const airQualityService = Container.get(AirQualityService);

export async function main() {
  logger.info('started');
  try {
    const iqAirResponse = await airQualityService.getRealtimeNearestCityAirQuality(options.lat, options.lon);
    logger.info(iqAirResponse);
    await airQualityService.createCityAirQuality(iqAirResponse);
    logger.info('finished successfully');
  } catch (e) {
    logger.error(e);
    logger.info('finished unsuccessfully');
  }
}

process.on('uncaughtException', halt);
process.on('unhandledRejection', halt);
process.on('SIGINT', halt);
process.on('SIGUSR1', halt);
process.on('SIGUSR2', halt);

cron.schedule('* * * * *', async () => {
  await main().catch(halt);
});

logger.info('started cron job, running every minute');
