# Jubo Server

## Getting Stared

```bash
# Install docker with Homebrew Cask
$ brew install --cask docker
# Check if docker is working.
$ docker --version
Docker version 24.0.6, build ed223bc
# Run postgreSQL on docker
$ docker run --name jubo-progres -p 5432:5432 -e POSTGRES_DB=jubo -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=jubopwd postgres:latest
# Run the jubo-be server
$ node main.js
```
