# Air Quality Backend API

Welcome to the Air Quality Backend API repository! Our project aims to deliver reliable air quality monitoring through a robust, technology-driven solution. In this document, you'll find detailed information about our technology stack, instructions for local deployment, API usage, database management, and testing procedures. 

To streamline development and testing, we provide a Docker-compose stack.

## Technologies Overview

This project utilizes a variety of modern technologies:

- **Node.js**: JavaScript runtime environment.
- **TypeScript**: A superset of JavaScript, adding static types.
- **Express** ([ExpressJS](https://expressjs.com/)): A minimal and flexible web application framework.
- **Tsoa** ([Tsoa](https://github.com/lukeautry/tsoa)): Simplifies building API-first controllers with automatic OpenAPI schema generation.
- **Prisma** ([Prisma](https://www.prisma.io/)): ORM for robust database management.
- **Apicache** ([Apicache](https://github.com/kwhitley/apicache)): Middleware for efficient caching and performance enhancement.
- **Pino** ([Pino](https://github.com/pinojs/pino)): A fast logging tool to improve application diagnostics.
- **Prometheus, Grafana**: Tools for in-depth monitoring and performance analysis.
- **Swagger-UI-express** ([Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express)): For interactive API documentation and exploration.
- **Redocly** ([Redocly](https://redocly.com/)): Produces comprehensive API documentation.
- **Typedi** ([Typedi](https://github.com/typestack/typedi)): Dependency injection library for cleaner code management.
- **Mollitia** ([Mollitia](https://genesys.github.io/mollitia/)): Implements a circuit breaker pattern for enhanced fault tolerance.
- **Jest/TS-Jest**: Robust frameworks for both unit and integration testing.
- **Eslint, Prettier**: Tools for ensuring code quality and consistency.
- **PostgreSQL**: A powerful and open-source relational database.

## Running the API Locally

Follow these steps to run the API in your local environment:

1. Create your environment file by copying `backend/.env.example` to `backend/.env`. Replace `IQ_AIR_API_KEY=xyz` with your valid IQ Air API key.
2. Start the application using Docker:

    ```bash
    docker-compose up
    ```

    This initializes the REST API server, cron job, PostgreSQL, Prometheus, and Grafana, and makes the API accessible at `localhost:5000`.

### Exploring the API Routes

Discover the API's capabilities through these routes:

- **Worst Air Quality Date Time**: Retrieve the date and time of the worst air quality for a specified city name. Example: [Paris](http://localhost:5000/v1/air-quality/worst-air-quality-date-time/paris)
- **Nearest City Air Quality**: Get real-time air quality data for the nearest city based on coordinates. Example: [Latitude 50, Longitude 50](http://localhost:5000/v1/air-quality/nearest-city?lat=50&lon=50)
- **Swagger UI**: Interact with our API and view documentation at [Swagger UI](http://localhost:5000/docs/).
- **API Metrics**: Monitor API performance with [Prometheus metrics](http://localhost:9999/metrics).
- **Grafana Dashboard**: Visualize API analytics on our [Grafana Dashboard](http://localhost:3000/d/1DYaynomMk/backend-service-dashboard?orgId=1&refresh=10s).

The OpenAPI schema can be found at `backend/src/generated/openapi.json`, with HTML documentation at `backend/src/generated/openapi.html`.

## Updating the Database Schema

To modify the database schema:

1. Edit `backend/prisma/schema.prisma`.
2. Apply your changes with Prisma:

    ```bash
    npx prisma migrate dev
    ```

    This updates the database schema and regenerates the Prisma client.

## Executing Tests

For testing, follow these steps:

1. Access the application container:

    ```bash
    docker exec -it fs-nodejs-backend-1 /bin/bash
    ```

2. Execute tests using these commands:
    - Unit and integration tests:

        ```bash
        npm run test
        ```

    - Integration tests with database reset (WARNING: All data will be erased):

        ```bash
        npm run test-e2e
        ```

## Additional Information

- **Cron Job**: Implemented using [node-cron](https://www.npmjs.com/package/cron) for seamless Docker integration. The job's script is located at `backend/src/bin/air-quality-cron-job.ts`.
