/**
 * Created by johnokeeffe on 10/03/2017.
 */
'use strict'

const Hapi = require('hapi')
const Vision = require('vision')
const Inert = require('inert')
const async = require('async')
const Bell = require('bell')
const AuthCookie = require('hapi-auth-cookie')
require('dotenv').config()

const initdb = require('./initdb')
const environment = process.env.ENVIRONMENT

const server = new Hapi.Server()

server.connection({ port: process.env.PORT || 4000 })

// server.register([Vision, Inert, Bell, AuthCookie, require('hapi-pino')], (err) => {
server.register([Vision, Inert, Bell, AuthCookie], (err) => {
  if (err) {
    console.log(err)
  }

  const authCookieOptions = {
    password: process.env.COOKIE_PASSWORD,
    cookie: 'room-scheduler-auth',
    isSecure: false
  }

  server.auth.strategy('room-scheduler-cookie', 'cookie', authCookieOptions)

  const bellAuthOptions = {
    provider: 'google',
    password: process.env.BELL_PASSWORD,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // forceHttps: true,
    // location: process.env.BELL_LOCATION,
    isSecure: false
  }

  if (environment === 'production') {
    bellAuthOptions.forceHttps = true
    bellAuthOptions.location = process.env.BELL_LOCATION
  }

  server.auth.strategy('google', 'bell', bellAuthOptions)

  server.auth.default('room-scheduler-cookie')

  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layout',
    partialsPath: './app/views/partials',
    helpersPath: './app/views/helpers',
    layout: true,
    isCached: false
  })

  server.route(require('./routes'))

  async.series([
    // F1 On app startup if its a dev environment create Rooms in db
    function (callback) {
      if (environment === 'dev') {
        initdb.createRooms(err => {
          if (err) return callback(err)
          callback()
        })
      } else { // if its production just sync with the existing db
        initdb.syncDB(err => {
          if (err) return callback(err)
          callback()
        })
      }
    },
    // F2 If its a dev environment create some test bookings
    function (callback) {
      if (environment === 'dev') {
        console.log('environment: ' + environment)
        initdb.seed(err => {
          if (err) return callback(err)
          callback()
        })
      }
      callback()
    }
  ], function (err) { // Then after F1 and F2 have returned, start the server
    if (err) return err
    server.start(err => {
      if (err) throw err
      console.log(`Server running at: ${server.info.uri}`)
    })
  }
  )
})
