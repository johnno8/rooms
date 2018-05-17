'use strict'

const models = require('../models')
const utils = require('../../lib/utils')
// const Joi = require('joi')

exports.adminhome = {
  auth: {
    strategy: 'room-scheduler-cookie',
    scope: ['admin']
  },

  handler: (request, reply) => {
    models.Room.findAll({}).then(rooms => {
      if (rooms) {
        reply.view('adminhome', {
          date: utils.getDate(),
          title: 'Admin console',
          rooms: rooms
        })
      } else {
        reply.view('adminhome', {
          date: utils.getDate(),
          title: 'Admin console',
          rooms: null
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }
}

exports.roomdetails = {
  auth: {
    strategy: 'room-scheduler-cookie',
    scope: ['admin']
  },

  handler: (request, reply) => {
    let data = request.payload
    console.log('roomdetails payload: ' + JSON.stringify(data, null, 2))

    models.Room.findOne({
      where: { id: data.id }
    }).then(room => {
      console.log('room: ' + JSON.stringify(room, null, 2))
      reply.view('roomdetail', {
        date: utils.getDate(),
        title: 'Room detail',
        room: room
      })
    }).catch(err => {
      console.log(err)
    })
  }
}

exports.editroom = {
  auth: {
    strategy: 'room-scheduler-cookie',
    scope: ['admin']
  },

  handler: (request, reply) => {
    let data = request.payload

    models.Room.update({
      id: data.id,
      name: data.name,
      capacity: data.capacity
    }, {
      where: {
        id: data.id
      }
    }).then(() => {
      models.Room.findOne({
        where: {
          id: data.id
        }
      }).then(returnedRoom => {
        console.log('updated room: ' + JSON.stringify(returnedRoom, null, 2))
        reply.view('roomdetail', {
          date: utils.getDate(),
          title: 'Room detail',
          room: returnedRoom,
          messages: [{ message: 'Room details successfully edited' }]
        })
      })
    }).catch(err => {
      console.log(err)
    })
  }
}

exports.createroom = {
  auth: {
    strategy: 'room-scheduler-cookie',
    scope: ['admin']
  },

  handler: (request, reply) => {
    let data = request.payload

    models.Room.findOrCreate({
      where: {
        id: data.id
      }
    }).spread((room, created) => {
      if (created) {
        models.Room.update({
          name: data.name,
          capacity: data.capacity
        }, {
          where: {
            id: data.id
          }
        }).then(() => {
          models.Room.findAll({}).then(rooms => {
            reply.view('adminhome', {
              date: utils.getDate(),
              title: 'Admin console',
              rooms: rooms,
              messages: [{message: 'Room successfully created'}]
            })
          })
        }).catch(err => {
          console.log(err)
        })
      } else {
        models.Room.findAll({}).then(rooms => {
          reply.view('adminhome', {
            date: utils.getDate(),
            title: 'Admin console',
            rooms: rooms,
            errors: [{message: 'Room already exists'}]
          })
        })
      }
    })
  }
}
