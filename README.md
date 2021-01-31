#Movie REST API service

##Description

The simplest REST API service implemented above express.js

See OpenAPI definition at [./swagger.json](./swagger.json)

The basic infrastructure includes:

 - an application
 - a PostgreSQL DB instance
 - a Postgres client in separate container (may be used to populate database)
 - TODO: connect and test redis instance

##Prerequisites

```
npm i
```

##Build

###Local

```
npm run build
```

###Docker

```
docker build -t movie-server -f ./Dockerfile .

```

##Run

###Prerequisites

####Generate data

```
./scripts/generate_movies.sh 50 `pwd`/sql/populate.sql
```

####Run environment

```
./scripts/run.sh

```

or

```
export NETWORK_GATEWAY="`docker network inspect --format '{{range .IPAM.Config}}{{.Gateway}}{{end}}' movie-server`" && \
CONFIG_PATH='./env/dev.config.json NODE_ENV=dev PORT=8080 APP_CONFIG_VOLUME=`pwd`/env POSTGRES_VOLUME=`pwd`/docker/postgres REDIS_VOLUME=`pwd`/docker/redis docker-compose up movie-server-postgres movie-server-client

#TODO bind and test movie-server-redis
```

####Initialize database, poplate with data

```
docker exec -it movie-server-client psql -h $NETWORK_GATEWAY -U movie_user -d movie -e -c "`cat sql/create.sql`"

#(type password 123456 when prompted)

docker exec -it movie-server-client psql -h $NETWORK_GATEWAY -U movie_user -d movie -e -c "DELETE FROM movie;SELECT setval(pg_get_serial_sequence('movie', 'id'), COALESCE(max(id) + 1, 1), false) FROM movie;`cat sql/populate.sql`"


#check it with for example
# 'pg_dump -h movie-server-postgres -U movie_user movie -t my_movie --schema-only' from inside o  movie-server-client container
# or
# docker exec -it movie-server-client psql -h $NETWORK_GATEWAY -U movie_user -d movie -e -c "SELECT * FROM movie;"

```


###Run the application

###Local

```
npm start
```


###Docker

####dev

```
docker run --rm --network movie-server --name movie-server -e NODE_ENV=dev -e CONFIG_PATH='./env/dev.config.json' -e PORT=8080 -p 8080:3000 movie-server

# or, with custom config,

docker run --rm -d --network movie-server --name movie-server -v `pwd`/env:/app/env -e NODE_ENV=dev -e CONFIG_PATH='./env/dev.config.json' -e PORT=8080 -p 8080:3000 movie-server

# or serve built app from local machine via Docker container

docker run --rm -d --network movie-server --name movie-server -v `pwd`/build:/app -v `pwd`/node_modules:/app/node_modules -v `pwd`/env:/app/env -e NODE_ENV=dev -e CONFIG_PATH='./env/dev.config.json' -e PORT=8080 -p 8080:3000 movie-server
```


####prod

```
docker run --rm --network movie-server --name movie-server -e NODE_ENV=prod -e CONFIG_PATH ./env/prod.config.json -e PORT=8080 -v `pwd`/env:/app/env -p 8081:8000 movie-server
```


##Test


####Local automatic tests

```
npm run build-test && npm run test

```

####Manually

#####Test app launched locally:

```
curl -iv 'http://localhost:3000/movies?page=1&perPage=10&orderBy=release_date&order=asc'

curl -iv 'http://localhost:3000/movie/1


```

#####Test app launched in Docker container:

```
curl -iv 'http://'$NETWORK_GATEWAY':8080/movies?page=1&perPage=10&orderBy=release_date&order=asc'

curl -iv 'http://'$NETWORK_GATEWAY':8080/movie/1'

```

#TODO

 - implement the rest of CRUD functionality
 - add Redis cache
 - test docker-compose.yml with clear space
 - use one logger library (pref. winston) for all classes
 - take logger transport from config
 - refactor routers
 - implement input validation
 - add search functionality to /movies route
 - add unit tests for all services
 - add integration test for the application
 - adjust Travis/Jenkins scripts
 - implement image upload/retrieval using S3 API
 - create a Postman collection
 