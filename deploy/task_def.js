const PG_HOST = process.env.PG_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME
const DIALECT = process.env.DIALECT
const ENVIRONMENT = process.env.ENVIRONMENT
const CIRCLE_BUILD_NUM = process.env.CIRCLE_BUILD_NUM
const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD
const BELL_PASSWORD = process.env.BELL_PASSWORD
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const BELL_LOCATION = process.env.BELL_LOCATION
const PORT = process.env.PORT

console.log(`{
  "containerDefinitions": [
    {
      "memory": 900,
      "name": "room-scheduler-app-container",
      "portMappings": [
        {
          "containerPort": 4000,
          "hostPort": 4000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "PG_HOST",
          "value": "${PG_HOST}"
        },
        {
          "name": "DB_USERNAME",
          "value": "${DB_USERNAME}"
        },
        {
          "name": "DB_PASSWORD",
          "value": "${DB_PASSWORD}"
        },
        {
          "name": "DB_NAME",
          "value": "${DB_NAME}"
        },
        {
          "name": "DIALECT",
          "value": "${DIALECT}"
        },
        {
          "name": "ENVIRONMENT",
          "value": "${ENVIRONMENT}"
        },
        {
          "name": "COOKIE_PASSWORD",
          "value": "${COOKIE_PASSWORD}"
        },
        {
          "name": "BELL_PASSWORD",
          "value": "${BELL_PASSWORD}"
        },
        {
          "name": "GOOGLE_CLIENT_ID",
          "value": "${GOOGLE_CLIENT_ID}"
        },
        {
          "name": "GOOGLE_CLIENT_SECRET",
          "value": "${GOOGLE_CLIENT_SECRET}"
        },
        {
          "name": "BELL_LOCATION",
          "value": "${BELL_LOCATION}"
        },
        {
          "name": "PORT",
          "value": "${PORT}"
        }
      ],
      "image": "156233825351.dkr.ecr.eu-west-1.amazonaws.com/room-scheduler:build-${CIRCLE_BUILD_NUM}",
      "cpu": 0
    }
  ],
  "family": "room-scheduler-task-def"
}`)
