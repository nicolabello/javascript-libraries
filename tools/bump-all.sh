#!/bin/sh

# https://stackoverflow.com/a/41553472/5631003
for DIR in ../libs/*/; do (

  yarn --cwd "$DIR" version --patch --no-commit-hooks

); done
