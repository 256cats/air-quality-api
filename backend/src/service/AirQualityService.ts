import { CityAirQuality } from '@prisma/client';
import { Service } from 'typedi';
import { IQAirClient } from '../client/IQAirClient';
import { RealtimeCityAirQuality } from '../model/AirQuality';
import { AirQualityRepository } from '../repository/AirQualityRepository';

@Service()
export class AirQualityService {
  constructor(
    private iQAirClient: IQAirClient,
    private airQualityRepository: AirQualityRepository,
  ) {}

  public async getRealtimeNearestCityAirQuality(lat: number, lon: number): Promise<RealtimeCityAirQuality> {
    return this.iQAirClient.getNearestCityAirQuality(lat, lon);
  }

  public async getWorstStoredAirQualityByCityName(cityName: string): Promise<CityAirQuality | null> {
    return this.airQualityRepository.findWorstAirQualityByCityName(cityName);
  }

  public async createCityAirQuality(cityAirQuality: RealtimeCityAirQuality): Promise<CityAirQuality> {
    return this.airQualityRepository.createCityAirQuality(cityAirQuality);
  }
}
