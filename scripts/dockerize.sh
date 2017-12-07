#! /usr/bin/env bash
set -e

docker build snex/web:$TRAVIS_COMMIT .
