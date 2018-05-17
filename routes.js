/**
 * Created by johnokeeffe on 10/03/2017.
 */
'use strict'

const Rooms = require('./app/controllers/rooms')
const Assets = require('./app/controllers/assets')
const Users = require('./app/controllers/users')
const Admins = require('./app/controllers/admins')

module.exports = [
  /*
  { method: 'GET', path: '/', config: Rooms.welcome },
  { method: 'GET', path: '/login', config: Rooms.login }, */

  { method: 'GET', path: '/', config: Users.welcome },
  { method: 'GET', path: '/login', config: Users.login },
  { method: 'GET', path: '/logout', config: Users.logout },

  { method: 'GET', path: '/adminhome', config: Admins.adminhome },
  { method: 'POST', path: '/roomdetails', config: Admins.roomdetails },
  { method: 'POST', path: '/editroom', config: Admins.editroom },
  { method: 'POST', path: '/createroom', config: Admins.createroom },

  { method: 'GET', path: '/home', config: Rooms.home },
  { method: 'GET', path: '/tomorrow', config: Rooms.tomorrow },
  { method: 'POST', path: '/makebooking', config: Rooms.makebooking },
  { method: 'POST', path: '/showdate', config: Rooms.showdate },
  { method: 'POST', path: '/booktoday', config: Rooms.booktoday },
  { method: 'POST', path: '/details', config: Rooms.details },
  { method: 'POST', path: '/delete/{id}', config: Rooms.deletebooking },
  // { method: 'GET', path: '/logout', config: Rooms.logout },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory
  }
]
