import { describe, expect, it, jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import fetch, { Response } from 'node-fetch';
import { Container } from 'typedi';
import { AirQualityController } from '../../../src/controller/AirQualityController';
import { PRISMA_CLIENT_TOKEN } from '../../../src/utils/prisma';

jest.mock('node-fetch');
jest.mock('@prisma/client');

describe('AirQualityController integration test', () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
  const mockPrismaClient: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();
  Container.set(PRISMA_CLIENT_TOKEN, mockPrismaClient);

  it('Should get nearest city air quality', async () => {
    const airQualityController = Container.get(AirQualityController);
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          status: 'success',
          data: {
            city: 'Paris',
            state: 'Ile-de-France',
            country: 'France',
            location: { type: 'Point', coordinates: [2.351666, 48.859425] },
            current: {
              pollution: {
                ts: '2023-12-29T22:00:00.000Z',
                aqius: 33,
                mainus: 'p2',
                aqicn: 14,
                maincn: 'o3',
              },
              weather: {
                ts: '2023-12-29T22:00:00.000Z',
                tp: 9,
                pr: 1015,
                hu: 90,
                ws: 3.6,
                wd: 230,
                ic: '02n',
              },
            },
          },
        }),
    } as Response);

    const result = await airQualityController.getNearestCityAirQuality(48.856613, 2.352222);
    expect(result).toEqual({
      Result: {
        Pollution: {
          ts: new Date('2023-12-29T22:00:00.000Z'),
          aqius: 33,
          mainus: 'p2',
          aqicn: 14,
          maincn: 'o3',
        },
      },
    });
  });

  it('Should get worst air quality date time by city name', async () => {
    const airQualityController = Container.get(AirQualityController);
    mockPrismaClient.cityAirQuality.findFirst.mockResolvedValue({
      id: 1,
      createdAt: new Date('2023-12-29T22:00:00.000Z'),
      updatedAt: new Date('2023-12-29T22:00:00.000Z'),
      cityName: 'paris',
      ts: new Date('2023-12-29T22:00:00.000Z'),
      aqius: 33,
      mainus: 'p2',
      aqicn: 14,
      maincn: 'o3',
    });

    const result = await airQualityController.getWorstAirQualityDateTimeByCityName('paris');
    expect(result).toEqual({
      Result: {
        WorstAirQuality: {
          dateTime: new Date('2023-12-29T22:00:00.000Z'),
        },
        cityName: 'paris',
      },
    });
  });
});
