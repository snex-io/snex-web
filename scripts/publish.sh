#! /usr/bin/env bash
set -e

docker tag snex/web:$TRAVIS_COMMIT snex/web:$TRAVIS_TAG

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"

docker push snex/web:$TRAVIS_TAG snex/web:$TRAVIS_COMMIT
