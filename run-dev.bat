@echo off

docker-compose --remove-orphans --profile jenkins-dev down
docker-compose --remove-orphans --profile jenkins-dev --env-file development.env up -d