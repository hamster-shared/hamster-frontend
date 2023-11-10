#!/opt/homebrew/bin/zsh

set -ex;

export PIPELINE_ID=$(date "+%Y%m%d%H%M%S")

# build
yarn build:production

#buildx
docker buildx build -t hamstershare/hamster-frontend:${PIPELINE_ID} --platform=linux/amd64 --push .

envsubst < deploy.yml | kubectl -n hamster apply -f -
