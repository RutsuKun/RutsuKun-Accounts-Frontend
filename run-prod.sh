docker-compose --remove-orphans --profile jenkins-prod down
docker-compose --remove-orphans --profile jenkins-prod --env-file production.env up -d