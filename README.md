# EventKita (Backend)
Web application where you can create your own events and let people join.

## Installation
```bash
$ npm install
```

## Required Environments
### Setup Related
- PORT

### Postgres Related
- POSTGRES_HOST
- POSTGRES_PORT
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB

### Firebase Related
- FIREBASE_TYPE
- FIREBASE_PROJECT_ID
- FIREBASE_PRIVATE_KEY_ID
- FIREBASE_PRIVATE_KEY
- FIREBASE_CLIENT_EMAIL
- FIREBASE_CLIENT_ID
- FIREBASE_AUTH_URI
- FIREBASE_TOKEN_URI
- FIREBASE_AUTH_PROVIDER_X509_CERT_URL
- FIREBASE_CLIENT_X509_CERT_URL


## Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# References
- https://medium.com/nerd-for-tech/nestjs-firebase-auth-secured-nestjs-resource-server-9649bcebd0de
- https://syntaxer.medium.com/nestjs-create-a-crud-api-using-typeorm-and-postgresql-2c1ae6c2726
- https://stackoverflow.com/questions/68396868/nestjs-middleware-with-dependencies