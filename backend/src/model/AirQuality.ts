import { CityAirQuality } from '@prisma/client';

export type RealtimeCityAirQuality = Pick<CityAirQuality, 'ts' | 'aqius' | 'aqicn' | 'maincn' | 'mainus' | 'cityName'>;

export type AirQuality = Pick<CityAirQuality, 'ts' | 'aqius' | 'aqicn' | 'maincn' | 'mainus'>;

export interface AirQualityResponse {
  Result: {
    Pollution: AirQuality;
  };
}

export interface WorstAirQualityDateTime {
  Result: {
    WorstAirQuality: {
      dateTime: Date;
    };
    cityName: string;
  } | null;
}
