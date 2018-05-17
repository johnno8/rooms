'use strict'

// const models = require('../models')
const fs = require('fs')

const logToFile = function (msg) {
  fs.writeFile('accesslog.txt', msg, {'flag': 'a'}, function (err) {
    if (err) return console.error(err)
    console.log('Access log amended')
  })
}

exports.welcome = {
  auth: false,

  handler: (request, reply) => {
    reply.view('login', {
      title: 'Log In'
    })
  }
}

exports.login = {
  auth: 'google',

  handler: (request, reply) => {
    if (request.auth.isAuthenticated && request.auth.credentials.profile.email === 'john.okeeffe@nearform.com') {
      request.cookieAuth.set({
        profile: request.auth.credentials.profile,
        isAdmin: true,
        scope: 'admin'
      })
      console.log('request.auth.credentials: ' + JSON.stringify(request.auth.credentials, null, 2))
      let d = new Date()
      let dstr = '' + d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) +
          ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' +
          ('0' + d.getSeconds()).slice(-2)
      logToFile('' + request.auth.credentials.profile.email + ' logged in ' + dstr + '\n')
      console.log('cookie: ' + JSON.stringify(request.auth.credentials, null, 2))
      // console.log('cookie.email: ' + request.auth.credentials.profile.profile.email)
      return reply.redirect('/home')
    } else if (request.auth.isAuthenticated) {
      request.cookieAuth.set({
        profile: request.auth.credentials.profile,
        isAdmin: false,
        scope: 'user'
      })
      console.log('request.auth.credentials: ' + JSON.stringify(request.auth.credentials, null, 2))
      let d = new Date()
      let dstr = '' + d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) +
          ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' +
          ('0' + d.getSeconds()).slice(-2)
      logToFile('' + request.auth.credentials.profile.email + ' logged in ' + dstr + '\n')
      return reply.redirect('/home')
    } else {
      // reply('Not logged in').code(401)
      let errors = []
      errors.push({message: 'Invalid credentials'})
      reply.view('login', {
        title: 'login error',
        errors: errors
      })
    }
  }
}

exports.logout = {

  handler: (request, reply) => {
    let d = new Date()
    let dstr = '' + d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) +
        ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' +
        ('0' + d.getSeconds()).slice(-2)
    logToFile('' + request.auth.credentials.profile.email + ' logged out ' + dstr + '\n')
    request.cookieAuth.clear()
    reply.redirect('/')
  }
}
