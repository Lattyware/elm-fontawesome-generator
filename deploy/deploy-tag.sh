#!/bin/sh
set -e

eval "$(ssh-agent -s)"
openssl aes-256-cbc -K $encrypted_509bb3f1cc0b_key -iv $encrypted_509bb3f1cc0b_iv -in deploy/elm-fontawesome.enc -out elm-fontawesome-deploy-key -d
chmod 600 ./elm-fontawesome-deploy-key
ssh-add ./elm-fontawesome-deploy-key

git config --global user.name "Gareth Latty"
git config --global user.email "gareth@lattyware.co.uk"

git clone "git@github.com:Lattyware/elm-fontawesome.git"
cd elm-fontawesome
git tag -a "${TRAVIS_TAG}" -m "${TRAVIS_COMMIT_MESSAGE}"
git push --quiet origin "${TRAVIS_TAG}"
