set dotenv-load

IMAGE_NAME:="ghcr.io/timesurgelabs/searchbase-llm:latest"

default:
  just --list

migrate:
  npx prisma migrate dev

dev:
  overmind start

dev-next:
  npm run dev

dev-db:
  docker run --name postgres-pgvector -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -p 5432:5432 -v $(pwd)/data/db:/var/lib/postgresql/data --rm ankane/pgvector

start:
  docker compose -f docker/docker-compose.yml --env-file=.env up

up:
  docker compose -f docker/docker-compose.yml --env-file=.env up -d

build-lite:
  docker compose -f docker/docker-compose-lite.yml --env-file=.env build

up-lite:
  docker compose -f docker/docker-compose-lite.yml --env-file=.env up -d

down-lite:
  docker compose -f docker/docker-compose-lite.yml down

logs-lite:
  docker compose -f docker/docker-compose-lite.yml logs

logs:
  docker compose -f docker/docker-compose.yml logs 

down:
  docker compose -f docker/docker-compose.yml down

build:
  docker compose -f docker/docker-compose.yml build

load directory server="http://localhost:3000":
  node scripts/load.js {{directory}} {{server}}

build-docker:
  docker build -t {{IMAGE_NAME}} . --build-arg DATABASE_URL=$DATABASE_URL -f docker/Dockerfile

generate:
  npx prisma generate

deploy:
  npx prisma migrate deploy
