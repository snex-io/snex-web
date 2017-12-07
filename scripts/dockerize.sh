#! /usr/bin/env bash
set -e

TAG="${TRAVIS_TAG:-$TRAVIS_COMMIT}"

echo "Docker tag: $TAG"

docker build -t snex/web:$TAG -t snex/web:latest .
