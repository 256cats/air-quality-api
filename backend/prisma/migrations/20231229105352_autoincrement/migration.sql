-- AlterTable
CREATE SEQUENCE cityairquality_id_seq;
ALTER TABLE "CityAirQuality" ALTER COLUMN "id" SET DEFAULT nextval('cityairquality_id_seq');
ALTER SEQUENCE cityairquality_id_seq OWNED BY "CityAirQuality"."id";
