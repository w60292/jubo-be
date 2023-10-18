# Jubo Server

## Development Environment
- OS: Mac OS Monterey v12.4
- Node: Node v16.20.2
- Docker: v24.0.6

## Prerequisite
```bash
# Install nvm and use node v16+
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Copy & Paste the following snippets into ~/.zshrc or ~/.bash_profile.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Apply the settings
$ source ~/.zshrc
$ nvm use 16
Now using node v16.20.2 (npm v8.19.4)

# Install docker with Homebrew Cask
$ brew install --cask docker
# Check if docker is working.
$ docker --version
Docker version 24.0.6, build ed223bc
```
## Getting Stared

```bash
# Run postgreSQL on docker
$ docker run --name jubo-progres -p 5432:5432 -e POSTGRES_DB=jubo -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=jubopwd postgres:latest
# Run the jubo-be server
$ yarn && node main.js
```

## Enjoy the service!
