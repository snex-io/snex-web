#! /usr/bin/env bash
set -e

docker build -t snex/web:$TRAVIS_TAG -t snex/web:latest .
