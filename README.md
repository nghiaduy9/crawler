# Night Watch crawler

## INSTALLATION

### Requirements

- Node.js >= 8
- Dotenv files: `.env.production` and/or `.env.development`

### Instructions

```bash
$ yarn install
$ yarn start # yarn dev for development
```

## DOCUMENTATION

## Environment Variables

- `NODE_ENV` (string): "development" or "production" environment
- `PORT` (number): Port number to run the server
- `NOTIFICATION_SERVICE_ADDRESS` (string): Address of notification service
- `MONGODB_URI` (string): Address of MongoDB
- `MONGODB_DB_NAME` (string): Name of MongoDB Database
### Routes

#### GET `/`

> Just for testing

##### Response body

- `iam`: `"/"`

#### POST `/`

> Execute a watch session

##### Request body

- `url` (string): URL to crawl
- `cssSelectors` (object): Mapping from CSS selectors to their types. Currently, only "string" is a valid type.
