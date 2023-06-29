#!/bin/bash

docker exec -it mongodb mongosh --quiet \
  --eval 'use admin' \
  --eval 'db.auth({ user: "root", pwd: "1234" })' \
  --eval 'use discriminator-demo' \
  --eval 'db.createUser({ user: "demo-user", pwd: "1234", roles: [{ role: "readWrite", db: "discriminator-demo" }] })' \
  --eval 'show users'
