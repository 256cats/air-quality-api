CREATE EXTENSION IF NOT EXISTS postgis;

-- CreateTable
CREATE TABLE "CityAirQuality" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL,
    "aqius" INTEGER NOT NULL,
    "mainus" TEXT NOT NULL,
    "aqicn" INTEGER NOT NULL,
    "maincn" TEXT NOT NULL,
    "cityName" TEXT NOT NULL,

    CONSTRAINT "CityAirQuality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "city_name_idx" ON "CityAirQuality"("cityName");

-- CreateIndex
CREATE UNIQUE INDEX "CityAirQuality_cityName_ts_key" ON "CityAirQuality"("cityName", "ts");
