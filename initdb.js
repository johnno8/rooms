/**
 * Created by johnokeeffe on 15/03/2017.
 */
'use strict'

const models = require('./app/models')
const shortid = require('shortid')

const syncDB = function (callback) {
  models.sequelize.sync().then(() => {
    callback(null)
  }).catch(err => {
    callback(err)
  })
}

const createRooms = function (callback) {
  models.sequelize.sync({force: true}).then(function () {
    models.Room.bulkCreate([
      {id: 40, name: 'Boardroom', capacity: '15-20'},
      {id: 36, name: 'Headquarters', capacity: '4'},
      {id: 4, name: 'Finance room', capacity: '4'},
      {id: 1, name: 'Call Booth 1', capacity: '1'},
      {id: 2, name: 'Call Booth 2', capacity: '1'}
    ]).then(() => {
      callback(null)
    }).catch(err => {
      callback(err)
    })
  })
}

const seed = function (callback) {
  let d = new Date()
  let today = '' + d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)

  models.Room.findAll().then(rooms => {
    rooms.forEach(r => {
      models.Booking.bulkCreate([
        {
          id: shortid.generate(),
          room: r.id,
          date: today,
          start: today + 'T11:00:00.000',
          end: today + 'T11:30:00.000',
          type: 'Internal',
          owner: 'john.okeeffe@nearform.com',
          description: 'Test booking',
          RoomId: r.id
        },
        {
          id: shortid.generate(),
          room: r.id,
          date: today,
          start: today + 'T12:00:00.000',
          end: today + 'T12:30:00.000',
          type: 'External',
          owner: 'dfgh@dfg.com',
          description: 'Test booking',
          RoomId: r.id
        }
      ])
    })
  }).catch(err => {
    callback(err)
  })

  callback(null)
}

module.exports = { seed, createRooms, syncDB }
