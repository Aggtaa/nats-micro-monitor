# nats-micro-monitor

## Requirements
1. node v16+ (tested on v16 only)
2. npm 7+
3. Nats 2.9+ with accounts enabled
4. .env file configured with NATS user and system account usernames and passwords

## WIP
Frontend is completely misssing

Installation
```
npm install
```

Start
```
npm start -w @nats-micro-monitor/backend
```
or 
```
cd apps/backend
npm start
```

For extra debug logging
```
DEBUG_LEVEL=DEBUG npm start -w @nats-micro-monitor/backend
```
or same as above
