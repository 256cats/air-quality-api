import apicache from 'apicache';
import { Controller, Get, Middlewares, Path, Query, Response, Route } from 'tsoa';
import { Service } from 'typedi';
import { AirQualityResponse, WorstAirQualityDateTime } from '../model/AirQuality';
import { AirQualityService } from '../service/AirQualityService';

interface ValidateErrorJSON {
  message: 'Validation failed';
  details: { [name: string]: unknown };
}

const apicacheToggle = () => !process.env.DISABLE_CACHE;

@Service()
@Route('air-quality')
export class AirQualityController extends Controller {
  constructor(private airQualityService: AirQualityService) {
    super();
  }

  /**
   * Returns realtime air quality of the nearest city.
   * Provide latitude and longitude.
   * @param lat latitude
   * @param lon longitude
   * @isFloat lat latitude must be float
   * @isFloat lon longitude must be float
   * @minimum lat -90 minimum latitude is -90
   * @maximum lat 90 minimum latitude is 90
   * @minimum lon -180 minimum longitude is -180
   * @maximum lon 180 minimum longitude is 180
   */
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Get('nearest-city')
  public async getNearestCityAirQuality(@Query() lat: number, @Query() lon: number): Promise<AirQualityResponse> {
    const airQuality = await this.airQualityService.getRealtimeNearestCityAirQuality(lat, lon);
    return {
      Result: {
        Pollution: {
          ts: airQuality.ts,
          aqius: airQuality.aqius,
          mainus: airQuality.mainus,
          aqicn: airQuality.aqicn,
          maincn: airQuality.maincn,
        },
      },
    };
  }

  /**
   * Returns the datetime of the worst stored air quality for the given city name.
   * Provide city name.
   * @param cityName city name
   * @isString cityName city name must be string
   */
  @Middlewares(apicache.middleware('1 minute', apicacheToggle))
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Get('worst-air-quality-date-time/{cityName}')
  public async getWorstAirQualityDateTimeByCityName(@Path() cityName: string): Promise<WorstAirQualityDateTime> {
    const airQuality = await this.airQualityService.getWorstStoredAirQualityByCityName(cityName);
    if (!airQuality) {
      this.setStatus(404);
      return {
        Result: null,
      };
    }

    return {
      Result: {
        WorstAirQuality: {
          dateTime: airQuality.ts,
        },
        cityName,
      },
    };
  }
}
