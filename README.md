# Night Watch crawler

## INSTALLATION

### Requirements

- Node.js >= 12.0.0

## DOCUMENTATION

## Environment Variables

- `NODE_ENV` (string): "development" or "production" environment
- `PORT` (number): Port number to run the server
- `GATEWAY_ADDRESS` (string): Address of the API gateway

### Routes

#### 1. GET `/`

> Just for testing

##### Response body

- `iam`: `"/"`

#### 2. POST `/`

> Execute a watch session

##### Request body

- `watchID` (ObjectID): ID of the watch
