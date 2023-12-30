import { describe, expect, it } from '@jest/globals';
import { IQAirClient } from '../../../src/client/IQAirClient';
import { RealtimeCityAirQuality } from '../../../src/model/AirQuality';
import { AirQualityRepository } from '../../../src/repository/AirQualityRepository';
import { AirQualityService } from '../../../src/service/AirQualityService';

const mockedIQAirClient: IQAirClient = {
  getNearestCityAirQuality: () =>
    Promise.resolve({
      cityName: 'paris',
      ts: new Date('2023-12-29T22:00:00.000Z'),
      aqius: 33,
      mainus: 'p2',
      aqicn: 14,
      maincn: 'o3',
    }),
} as any;

const mockedAirQualityRepository: AirQualityRepository = {
  findWorstAirQualityByCityName: () =>
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
  createCityAirQuality: (airQuality: RealtimeCityAirQuality) =>
    Promise.resolve({
      id: 2,
      createdAt: new Date('2023-12-29T22:00:00.000Z'),
      updatedAt: new Date('2023-12-29T22:00:00.000Z'),
      ...airQuality,
    }),
} as any;

describe('AirQualityService test', () => {
  it('Should get realtime nearest city air quality', async () => {
    const airQualityService = new AirQualityService(mockedIQAirClient, mockedAirQualityRepository);
    const result = await airQualityService.getRealtimeNearestCityAirQuality(48.856613, 2.352222);
    expect(result).toEqual({
      ts: new Date('2023-12-29T22:00:00.000Z'),
      aqius: 33,
      mainus: 'p2',
      aqicn: 14,
      maincn: 'o3',
      cityName: 'paris',
    });
  });

  it('Should get worst stored air quality by city name', async () => {
    const airQualityService = new AirQualityService(mockedIQAirClient, mockedAirQualityRepository);
    const result = await airQualityService.getWorstStoredAirQualityByCityName('paris');
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
    const airQualityService = new AirQualityService(mockedIQAirClient, mockedAirQualityRepository);
    const result = await airQualityService.createCityAirQuality({
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
