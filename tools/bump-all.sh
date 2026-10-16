#!/bin/sh

# Bumps the patch version of every library
for DIR in ./libs/*/; do (

  cd "$DIR" && npm version patch --no-git-tag-version

); done
