import { describe, expect, it } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { AirQualityRepository } from '../../../src/repository/AirQualityRepository';

const mockedPrismaClient: PrismaClient = {
  cityAirQuality: {
    findFirst: () =>
      Promise.resolve({
        id: 1,
        createdAt: new Date('2023-12-29T22:00:00.000Z'),
        updatedAt: new Date('2023-12-29T22:00:00.000Z'),
        cityName: 'paris',
        ts: new Date('2023-12-29T22:00:00.000Z'),
        aqius: 33,
        mainus: 'p2',
        aqicn: 14,
        maincn: 'o3',
      }),
    create: () =>
      Promise.resolve({
        id: 2,
        createdAt: new Date('2023-12-29T22:00:00.000Z'),
        updatedAt: new Date('2023-12-29T22:00:00.000Z'),
        cityName: 'paris',
        ts: new Date('2023-12-29T22:00:00.000Z'),
        aqius: 33,
        mainus: 'p2',
        aqicn: 14,
        maincn: 'o3',
      }),
  },
} as any;

describe('AirQualityRepository test', () => {
  it('Should find worst air quality by city name', async () => {
    const airQualityRepository = new AirQualityRepository(mockedPrismaClient);
    const result = await airQualityRepository.findWorstAirQualityByCityName('paris');
    expect(result).toEqual({
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
  });

  it('Should create air quality', async () => {
    const airQualityRepository = new AirQualityRepository(mockedPrismaClient);
    const result = await airQualityRepository.createCityAirQuality({
      cityName: 'paris',
      ts: new Date('2023-12-29T22:00:00.000Z'),
      aqius: 33,
      mainus: 'p2',
      aqicn: 14,
      maincn: 'o3',
    });

    expect(result).toEqual({
      id: 2,
      createdAt: new Date('2023-12-29T22:00:00.000Z'),
      updatedAt: new Date('2023-12-29T22:00:00.000Z'),
      cityName: 'paris',
      ts: new Date('2023-12-29T22:00:00.000Z'),
      aqius: 33,
      mainus: 'p2',
      aqicn: 14,
      maincn: 'o3',
    });
  });
});
