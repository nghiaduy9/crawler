# NIGHT WATCH CRAWLER

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

| ROUTE  | METHOD | REQ BODY                                | RES BODY               | USE                     |
| ------ | ------ | --------------------------------------- | ---------------------- | ----------------------- |
| `/`    | GET    |                                         | `{ iam: '/' }`         |
| `/api` | GET    |                                         | `{ iam: '/api' }`      |
| `/api` | POST   | `{ url: string, cssSelectors: object }` | `{ success: boolean }` | Execute a watch session |
