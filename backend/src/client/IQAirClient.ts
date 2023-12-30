import { Circuit, Timeout } from 'mollitia';
import fetch, { Response } from 'node-fetch';
import { Service } from 'typedi';
import { RealtimeCityAirQuality } from '../model/AirQuality';
import { getEnv } from '../utils/env';
import IQAirClientError from './IQAirClientError';

const circuit = new Circuit({
  options: {
    modules: [
      new Timeout({
        delay: 1000,
      }),
    ],
  },
});

@Service()
export class IQAirClient {
  constructor(
    private baseUrl = getEnv('IQ_AIR_API_BASE_URL'),
    private apiKey = getEnv('IQ_AIR_API_KEY'),
  ) {}

  public async getNearestCityAirQuality(lat: number, lon: number): Promise<RealtimeCityAirQuality> {
    const result: Response = await circuit
      .fn(() => fetch(`${this.baseUrl}/v2/nearest_city?lat=${lat}&lon=${lon}&key=${this.apiKey}`))
      .execute();

    const json = await result.json();

    if (json.status !== 'success') {
      throw new IQAirClientError(json.data.message);
    }

    const { pollution } = json.data.current;

    return {
      cityName: json.data.city.toLowerCase(),
      ts: new Date(pollution.ts),
      aqius: pollution.aqius,
      mainus: pollution.mainus,
      aqicn: pollution.aqicn,
      maincn: pollution.maincn,
    };
  }
}
