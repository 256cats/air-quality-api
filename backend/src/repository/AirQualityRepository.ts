import { CityAirQuality, PrismaClient } from '@prisma/client';
import { Inject, Service } from 'typedi';
import { RealtimeCityAirQuality } from '../model/AirQuality';
import { PRISMA_CLIENT_TOKEN } from '../utils/prisma';

@Service()
export class AirQualityRepository {
  constructor(
    @Inject(PRISMA_CLIENT_TOKEN)
    private prismaClient: PrismaClient,
  ) {}

  public async findWorstAirQualityByCityName(cityName: string): Promise<CityAirQuality | null> {
    return this.prismaClient.cityAirQuality.findFirst({
      where: {
        cityName,
      },
      orderBy: [
        {
          aqius: 'desc',
        },
        {
          aqicn: 'desc',
        },
      ],
    });
  }

  public async createCityAirQuality(cityAirQuality: RealtimeCityAirQuality): Promise<CityAirQuality> {
    return this.prismaClient.cityAirQuality.create({
      data: {
        ...cityAirQuality,
      },
    });
  }
}
