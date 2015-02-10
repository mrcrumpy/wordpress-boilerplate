#!/bin/bash


#TODO: IDEA: install script and run script!!! this could be the install script
#after installation: docker start $APP_NAME, etc.

APP_NAME="boilerplate2"
MYSQL_ROOT_PASS="root"

MYSQL_NAME=$APP_NAME"_mysql"
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

if [ ! -f $DIR/docker/mysql/auto.cnf ]
  then
    echo 'setting up database. please be patient...'
    docker run -v $DIR/docker/mysql:/var/lib/mysql crollalowis/mysql /bin/bash -c "/usr/bin/mysql_install_db"
fi

docker run -d \
  -p 3306:3306 \
  -v $DIR/docker/mysql:/var/lib/mysql:rw \
  --name="$MYSQL_NAME" \
  -e MYSQL_PASS=$MYSQL_ROOT_PASS \
  crollalowis/mysql

docker run \
  -p 80:80 \
  -v $DIR/docker/config/sites-enabled:/etc/nginx/sites-enabled:rw \
  -v $DIR/docker/log:/var/log/nginx:rw \
  -v $DIR:/var/www:rw \
  --link $MYSQL_NAME:$MYSQL_NAME \
  --name="$APP_NAME" \
  -d crollalowis/php5
