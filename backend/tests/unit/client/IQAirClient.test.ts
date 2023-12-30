import { describe, expect, it, jest } from '@jest/globals';
import { TimeoutError } from 'mollitia';
import fetch, { Response } from 'node-fetch';
import { IQAirClient } from '../../../src/client/IQAirClient';
import IQAirClientError from '../../../src/client/IQAirClientError';

jest.mock('node-fetch');

const delay = (res: any, timeout: number) => new Promise((resolve) => setTimeout(() => resolve(res), timeout));

describe('IQAirClient test', () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  it('Should get nearest city air quality', async () => {
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

    const iQAirClient = new IQAirClient('abc', 'abc');

    const result = await iQAirClient.getNearestCityAirQuality(48.856613, 2.352222);

    expect(result).toEqual({
      cityName: 'paris',
      ts: new Date('2023-12-29T22:00:00.000Z'),
      aqius: 33,
      mainus: 'p2',
      aqicn: 14,
      maincn: 'o3',
    });
  });

  it('Should throw when upstream city not found', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          status: 'fail',
          data: { message: 'city_not_found' },
        }),
    } as Response);

    const iQAirClient = new IQAirClient('abc', 'abc');

    await expect(iQAirClient.getNearestCityAirQuality(48.856613, 2.352222)).rejects.toThrow(IQAirClientError);
  });

  it('Should throw when upstream timeouts', async () => {
    mockFetch.mockResolvedValue(
      delay(
        {
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
        },
        1200,
      ) as any,
    );

    const iQAirClient = new IQAirClient('abc', 'abc');

    await expect(iQAirClient.getNearestCityAirQuality(48.856613, 2.352222)).rejects.toThrow(TimeoutError);
  });
});
