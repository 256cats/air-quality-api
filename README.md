# Air Quality Backend API

Welcome to the repository for the Air Quality Backend API. This project is designed to monitor air quality metrics using a variety of technologies. Below, you'll find an overview of the technologies used and instructions on how to run the API, update the database schema, and execute tests. 

Docker-compose stack for easier development and testing is provided.

## Technologies Used

- **Node.js**
- **TypeScript**
- **Express** ([https://expressjs.com/](https://expressjs.com/)): A web application framework
- **Tsoa** ([https://github.com/lukeautry/tsoa](https://github.com/lukeautry/tsoa)): Empowering API-first controllers, request payload validation, and automatic OpenAPI schema generation
- **Prisma** ([https://www.prisma.io/](https://www.prisma.io/)): An Object-Relational Mapping (ORM) tool
- **Apicache** ([https://github.com/kwhitley/apicache](https://github.com/kwhitley/apicache)): Caching middleware for enhanced performance
- **Pino** ([https://github.com/pinojs/pino](https://github.com/pinojs/pino)): A logger for better logging capabilities
- **Prometheus, Grafana**: Monitoring tools for insightful performance analysis
- **Swagger-UI-express** ([https://www.npmjs.com/package/swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)): Auto-generated API documentation and an API playground
- **Redocly** ([https://redocly.com/](https://redocly.com/)): Generating API documentation
- **Typedi** ([https://github.com/typestack/typedi](https://github.com/typestack/typedi)): A dependency injection library
- **Mollitia** ([https://genesys.github.io/mollitia/](https://genesys.github.io/mollitia/)): A circuit breaker for better fault tolerance
- **Jest**/**TS-Jest**: Testing framework
- **Eslint**, **Prettier**: Code linting and formatting tools
- **PostgreSQL**: The chosen relational database

## How to run the API locally

1. Copy `backend/.env.example` to `backend/.env` and replace `IQ_AIR_API_KEY=xyz` with your valid IQ Air API key.
2. Execute the following command:

    ```bash
    docker-compose up
    ```

   This command initializes the REST API server, cron job, PostgreSQL, Prometheus, and Grafana. The API can be accessed at `localhost:5000` by default.

### Available Routes

- **Worst Air Quality Date Time**: [Link](http://localhost:5000/v1/air-quality/worst-air-quality-date-time/{cityName}) - Returns the worst air quality date time recorded by the cron job for a given city name. Example: [Paris](http://localhost:5000/v1/air-quality/worst-air-quality-date-time/paris)

- **Nearest City**: [Link](http://localhost:5000/v1/air-quality/nearest-city?lat={lat}&lon={lon}) - Returns real-time air quality for the nearest city (from IQ Air API) based on given coordinates. Example: [Latitude 50, Longitude 50](http://localhost:5000/v1/air-quality/nearest-city?lat=50&lon=50)

- **Swagger UI**: [Link](http://localhost:5000/docs/) - API playground and auto-generated API documentation

- **API Metrics**: [Link](http://localhost:9999/metrics) - Metrics consumed by Prometheus

- **Grafana Dashboard**: [Link](http://localhost:3000/d/1DYaynomMk/backend-service-dashboard?orgId=1&refresh=10s) with 

The OpenAPI schema is located at `backend/src/generated/openapi.json`, and API docs are at `backend/src/generated/openapi.html`.

## How to Update Database Schema

1. Modify `backend/prisma/schema.prisma`.
2. Run the following command:

    ```bash
    npx prisma migrate dev
    ```

   This command applies migrations and regenerates the Prisma client.

## How to Run Tests

1. Connect to the app container:

    ```bash
    docker exec -it fs-nodejs-backend-1 /bin/bash
    ```

2. Run the following commands:

    - Unit and integration tests:

        ```bash
        npm run test
        ```

    - Integration tests (WARNING: erases all data from the database):

        ```bash
        npm run test-e2e
        ```

## Miscellaneous Notes

- For the cron job, [node-cron](https://www.npmjs.com/package/cron) is used for easier integration with Docker. The actual job is in `backend/src/bin/air-quality-cron-job.ts`
