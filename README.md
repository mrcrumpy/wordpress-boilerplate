## Install

- `git clone --recursive [git-url]`
- `docker-compose up -d` (maybe has to be executed 2 times because of init)
- `./sql/create_database.sh sql/[newest_sql_dump].sql`
    - without sql dump:
        - rename public/wp-config.php and go through WP install process
        - after installation change filename back to wp-config.php and remove public/wp/wp-config.php
- `npm install`
- `gulp dist` (creates theme for the first time)

# serve

- apache serves `/public` directory
- `gulp` (watch with livereload)
- `gulp dist` (dist with rev and min)

# create database dump

- `./sql/dump_database.sh`

# configuration

- create .env.config.php per environment basis and put it on the server
- set `APP_ENV` to determine which enviroment to load (local, staging, production)


# deployment

- create artifacts:
    - `public`: public webserver
    - `.env.config.php` : set environment variables
    - `config` : environment configurations