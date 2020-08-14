# ImageBoardBE

ImageBoard is a web application that enables users to upload and view images in the form of a post (similar to Instagram)

### Setup

## Setting up the environment
- In order to run the app you must define these env variables in the `.env` file (in the root service path similar to example shown below):
```
DB_URL = mongodb://localhost:27017/InstaClone
JWT_SECRET = 51778657246321226641fsdklafjasdkljfsklfjd7148924065
REFRESH_TOKEN_EXPIRY_TIME_IN_DAYS = 10
JWT_EXPIRATION_TIME = 15m
```
## Running the service (`locally`)
- You must have node and npm installed
- You must have mongoDB installed and running (define DB_URL in .env)
- In case of running locally run:

```
npm install
npm start
```

### Credits


- [Šabović Dženana](https://github.com/dsabovic1), 
- [Anida Mujezin](https://github.com/anida21),
- [Eldar Čelik](https://github.com/eldarcelik),
- [Arslan Turkušić](https://github.com/aturkusic)

