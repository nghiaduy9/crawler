# Night Watch crawler

## INSTALLATION

### Requirements

- Node.js >= 12.0.0

## DOCUMENTATION

## Environment Variables

- `NODE_ENV` (string): "development" or "production" environment
- `PORT` (number): Port number to run the server
- `MONGODB_URI` (string): MongoDB URI
- `MONGODB_DB_NAME` (string): Database name
- `GATEWAY_ADDRESS` (string): Address of the API gateway

### Routes

#### GET `/`

> Just for testing

##### Response body

- `iam`: `"/"`

#### POST `/`

> Execute a watch session

##### Request body

- `watchID` (ObjectID): ID of the watch
