#!/bin/bash
#Lanches an environment, opens psql console. If 'run' is provided as 1st argument, launches application in Docker with ./build dir as voluume
#Run as `run.sh [run]`
NETWORK_NAME='movie-server'
NETWORK_EXISTS="`docker network ls -f "name=$NETWORK_NAME" --format '{{.Name}}'`";
echo 'NETWORK_EXISTS='$NETWORK_EXISTS;
if [ -z $NETWORK_EXISTS ]; then
    echo "Creating a network...";
    docker network create --driver bridge $NETWORK_NAME
fi

NETWORK_GATEWAY="`docker network inspect --format '{{range .IPAM.Config}}{{.Gateway}}{{end}}' $NETWORK_NAME`"
echo 'NETWORK_GATEWAY='$NETWORK_GATEWAY;

export NETWORK_GATEWAY;

docker run --rm -d --network movie-server --name movie-server-postgres -v `pwd`/docker/postgres/data:/var/lib/postgresql/data -v `pwd`/docker/postgres/conf/postgresql.conf:/etc/postgresql/postgresql.conf -e POSTGRES_DB=movie -e POSTGRES_USER=movie_user -e POSTGRES_PASSWORD=123456 -p 5432:5432 postgres:10 -c 'config_file=/etc/postgresql/postgresql.conf'

echo "Launched Postgres instance with name 'movie-server-postgres'. Run\n\ndocker logs -f movie-server-postgres\n\nto see Postgres logs."

#TODO
#REDIS_VOLUME=/home/$USER/javadev/data/ratpack_app docker run --name ratpack_app-redis -v $REDIS_VOLUME/data:/data -v -v $REDIS_VOLUME/conf/redis.conf:/usr/local/etc/redis/redis.conf -d redis redis-server --appendonly yes

if [ -z $1 ]; then
    echo "Don't run application..."
elif [ $1 == run ]; then
    echo "Running application..";
    docker run --rm -d --network movie-server --name movie-server -v `pwd`/build:/app -v `pwd`/node_modules:/app/node_modules -v `pwd`/env:/app/env -e NODE_ENV=dev -e CONFIG_PATH='./env/dev.config.json' -e PORT=8080 -p 8080:3000 movie-server

    echo "Launched application instance with name 'movie-server'. Run\n\ndocker logs -f movie-server\n\nto see Postgres logs."
fi

echo "Starting psql Postgres client..."

docker run -it --rm --network movie-server --name movie-server-client postgres:10 psql -h movie-server-postgres -U movie_user -d movie
