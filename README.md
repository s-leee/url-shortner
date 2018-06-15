# URL shortner
A basic URL shortening application which a user can provide a URL and will be given a custom shortened URL that will redirect to the original one.

Current version: 0.1.0

## Prerequisite
MongoDB needs to be installed and run.
For MacOS:
```
brew install mongodb
mkdir -p /data/db
mongod
```

reference: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

## Run
```
npm install
```
For development:
```
npm run dev
```
For production:
```
npm run build
npm run start
```

## Testing
Client:
```
npm run test-client
```
Server:
```
npm run test-server
```
