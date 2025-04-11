# Node Skybook Event Handler

This simple node service accepts incoming JSON messages 
triggered by events such as sector sign off, and saves 
the contents to a JSON file on disk.

## Install

All requirements are added via ```npm install && npm run build```

## Usage

The server can be started with the command ```node dist/index.js```

or with Docker:
`docker compose up`

### Run tests

Test can be run through the command ```npm test```
