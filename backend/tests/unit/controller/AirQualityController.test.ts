import { describe, expect, it } from '@jest/globals';
import { AirQualityController } from '../../../src/controller/AirQualityController';
import { AirQualityService } from '../../../src/service/AirQualityService';

const mockedAirQualityService: AirQualityService = {
  getRealtimeNearestCityAirQuality: () =>
    Promise.resolve({
      cityName: 'paris',
      ts: new Date('2023-12-29T22:00:00.000Z'),
      aqius: 33,
      mainus: 'p2',
      aqicn: 14,
      maincn: 'o3',
    }),
  getWorstStoredAirQualityByCityName: () =>
    Promise.resolve({
      ts: new Date('2023-12-29T22:00:00.000Z'),
      aqius: 33,
      mainus: 'p2',
      aqicn: 14,
      maincn: 'o3',
    }),
} as any;

describe('AirQualityController test', () => {
  it('Should get nearest city air quality', async () => {
    const airQualityController = new AirQualityController(mockedAirQualityService);
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
    const airQualityController = new AirQualityController(mockedAirQualityService);
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

  it('Should return 404 when no data found', async () => {
    const airQualityController = new AirQualityController({
      getWorstStoredAirQualityByCityName: () => Promise.resolve(null),
    } as any);
    const result = await airQualityController.getWorstAirQualityDateTimeByCityName('paris');
    expect(result).toEqual({
      Result: null,
    });
    expect(airQualityController.getStatus()).toEqual(404);
  });
});
