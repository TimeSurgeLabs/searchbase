set dotenv-load

IMAGE_NAME:="ghcr.io/timesurgelabs/searchbase-llm:latest"

migrate:
  npx prisma migrate dev

dev:
  overmind start

dev-next:
  npm run dev

dev-db:
  docker run --name postgres-pgvector -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -p 5432:5432 -v $(pwd)/data/db:/var/lib/postgresql/data --rm ankane/pgvector

start: build-docker
  docker compose -f docker/docker-compose.yml --env-file=.env up

up: build-docker
  docker compose -f docker/docker-compose.yml --env-file=.env up -d

down:
  docker compose down

load directory server="http://localhost:3000":
  node scripts/load.js {{directory}} {{server}}

build-docker:
  docker build -t {{IMAGE_NAME}} . --network host --build-arg OPENAI_APIKEY=$OPENAI_APIKEY --build-arg DATABASE_URL=$DATABASE_URL --build-arg NEXTAUTH_URL=$NEXTAUTH_URL --build-arg NEXTAUTH_SECRET=$NEXTAUTH_SECRET  --build-arg GITHUB_ID=$GITHUB_ID --build-arg GITHUB_SECRET=$GITHUB_SECRET

generate:
  npx prisma generate
