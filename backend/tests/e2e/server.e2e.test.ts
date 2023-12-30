import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import dotenv from 'dotenv';
import express, { Request, Response, urlencoded } from 'express';
import { Server } from 'http';
import supertest from 'supertest';
import Container from 'typedi';
import { main } from '../../src/server';
import { PRISMA_CLIENT_TOKEN } from '../../src/utils/prisma';
dotenv.config({ path: __dirname + '/.env.test', override: true });

export function startMockIQAirApi() {
  const app = express();
  app.use(
    urlencoded({
      extended: true,
    }),
  );
  app.use(express.json({ limit: '1 MB' }));

  app.get('/v2/nearest_city', async (_: Request, res: Response) => {
    res.status(200);
    res.json({
      status: 'success',
      data: {
        city: 'Paris',
        state: 'Ile-de-France',
        country: 'France',
        location: { type: 'Point', coordinates: [2.351666, 48.859425] },
        current: {
          pollution: {
            ts: '2023-12-30T13:00:00.000Z',
            aqius: 39,
            mainus: 'p2',
            aqicn: 14,
            maincn: 'p2',
          },
          weather: {
            ts: '2023-12-30T13:00:00.000Z',
            tp: 10,
            pr: 1013,
            hu: 91,
            ws: 5.14,
            wd: 170,
            ic: '04d',
          },
        },
      },
    });
    res.end();
  });

  return app.listen(7000, () => {
    console.log(`Mock IQAir on port 7000`);
  });
}

describe('App e2e test', () => {
  let mockIQAirServer: Server, appServer: Server, promServer: Server;

  beforeAll(async () => {
    mockIQAirServer = startMockIQAirApi();
    const res = await main();
    appServer = res.appServer;
    promServer = res.promServer;
  });

  afterAll(async () => {
    mockIQAirServer.close();
    appServer.close();
    promServer.close();
    await Container.get(PRISMA_CLIENT_TOKEN).$disconnect();
  });

  it('Should get nearest city air quality', async () => {
    const response = await supertest(appServer)
      .get(`/v1/air-quality/nearest-city?lat=48.856613&lon=2.352222`)
      .expect(200);
    expect(response.body).toEqual({
      Result: {
        Pollution: {
          ts: '2023-12-30T13:00:00.000Z',
          aqius: 39,
          mainus: 'p2',
          aqicn: 14,
          maincn: 'p2',
        },
      },
    });
  });

  it('Should get worst air quality date time by city name', async () => {
    const prisma = Container.get(PRISMA_CLIENT_TOKEN);
    await prisma.cityAirQuality.deleteMany();
    await prisma.cityAirQuality.createMany({
      data: [
        {
          cityName: 'paris',
          ts: new Date('2023-12-29T22:01:00.000Z'),
          aqius: 33,
          mainus: 'p2',
          aqicn: 11,
          maincn: 'o3',
        },
        {
          cityName: 'paris',
          ts: new Date('2023-12-29T22:02:00.000Z'),
          aqius: 34,
          mainus: 'p2',
          aqicn: 14,
          maincn: 'o3',
        },
        {
          cityName: 'paris',
          ts: new Date('2023-12-29T22:03:00.000Z'),
          aqius: 37,
          mainus: 'p2',
          aqicn: 10,
          maincn: 'o3',
        },
        {
          cityName: 'paris',
          ts: new Date('2023-12-29T22:04:00.000Z'),
          aqius: 25,
          mainus: 'p2',
          aqicn: 14,
          maincn: 'o3',
        },
      ],
    });

    const response = await supertest(appServer).get(`/v1/air-quality/worst-air-quality-date-time/paris`).expect(200);
    expect(response.body).toEqual({
      Result: {
        WorstAirQuality: {
          dateTime: '2023-12-29T22:03:00.000Z',
        },
        cityName: 'paris',
      },
    });
  });
});
