#!/opt/homebrew/bin/zsh

set -ex;

export PIPELINE_ID=$(date "+%Y%m%d%H%M%S")

# build
yarn install
#yarn build:staging
node --max_old_space_size=16384 ./node_modules/vite/bin/vite.js build --mode staging

#buildx
docker buildx build -t hamstershare/hamster-frontend:${PIPELINE_ID} --platform=linux/amd64 --push .

envsubst < deploy.yml | kubectl -n hamster apply -f -
