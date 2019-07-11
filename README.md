# Night Watch crawler

## INSTALLATION

### Requirements

- Node.js >= 8
- Dotenv files: `.env.production` and/or `.env.development`
- Firebase Account Service file: `firebase-key.private.json`

### Instructions

```bash
$ yarn install
$ yarn start # yarn dev for development
```

## DOCUMENTATION

### Routes

#### GET `/`

> Just for testing

##### Response body

- iam: `"/"`

#### POST `/`

> Execute a watch session

##### Request body

- url (string): URL to crawl
- cssSelectors (object): Mapping from CSS selectors to their types. Currently, only "string" is a valid type.

##### Response body

- success (boolean): Status
