/**
 * Created by johnokeeffe on 10/03/2017.
 */
'use strict'

const models = require('../models')
const shortid = require('shortid')
const async = require('async')
const Joi = require('joi')
const utils = require('../../lib/utils')

exports.home = {

  auth: {
    strategies: ['room-scheduler-cookie', 'google']
  },

  handler: (request, reply) => {
    let date = utils.getDate()
    utils.getMeetings(date, (err, roomData) => {
      if (err) console.log(err)
      console.log('getMeetings() roomData: ' + JSON.stringify(roomData, null, 2))
      reply.view('meetings', {
        date: date,
        title: 'Scheduled meetings',
        bookedRooms: roomData.bookedRooms,
        rooms: roomData.returnedRooms,
        isAdmin: request.auth.credentials.isAdmin
      })
    })
  }
}

exports.tomorrow = {

  handler: (request, reply) => {
    let today = new Date()
    today = today.setDate(today.getDate() + 1)
    let tomorrow = new Date(today)
    tomorrow = '' + tomorrow.getFullYear() + '-' + ('0' + (tomorrow.getMonth() + 1)).slice(-2) + '-' + ('0' + tomorrow.getDate()).slice(-2)
    console.log('tomorrow: ' + tomorrow)

    utils.getMeetings(tomorrow, (err, roomData) => {
      if (err) console.log(err)
      console.log('getMeetings() roomData: ' + JSON.stringify(roomData, null, 2))
      reply.view('meetings', {
        date: tomorrow,
        title: 'Scheduled meetings',
        bookedRooms: roomData.bookedRooms,
        rooms: roomData.returnedRooms,
        isAdmin: request.auth.credentials.isAdmin
      })
    })
  }
}

exports.booktoday = {

  handler: (request, reply) => {
    let data = request.payload
    console.log('booktoday payload:' + JSON.stringify(data, null, 2))
    let d = new Date(data.date)

    reply.view('bookaroom', {
      title: 'Book a room',
      roomId: data.room,
      date: d,
      isAdmin: request.auth.credentials.isAdmin
    })
  }
}

exports.showdate = {

  handler: (request, reply) => {
    console.log(request.payload)
    console.log('\nshowdate handler date: ' + request.payload.date + '\n')
    let date = new Date(request.payload.date)
    console.log(date)

    utils.getMeetings(date, (err, roomData) => {
      if (err) console.log(err)
      console.log('getMeetings() roomData: ' + JSON.stringify(roomData, null, 2))
      reply.view('meetings', {
        date: date,
        title: 'Scheduled meetings',
        bookedRooms: roomData.bookedRooms,
        rooms: roomData.returnedRooms,
        isAdmin: request.auth.credentials.isAdmin
      })
    })
  }
}

exports.details = {

  handler: (request, reply) => {
    let data = request.payload
    console.log('\ndetails handler id: ' + data.room + ', date: ' + data.date + '\n')

    models.Room.findOne({
      where: { id: data.room },
      include: [{
        model: models.Booking,
        where: { date: data.date }
      }]
    }).then(room => {
      room.Bookings = room.Bookings.sort((a, b) => {
        return a.start - b.start
      })
      reply.view('details', {
        date: data.date,
        title: 'Booking details',
        room: room,
        user: request.auth.credentials.profile.email,
        isAdmin: request.auth.credentials.isAdmin
      })
    }).catch(err => {
      console.log(err)
    })
  }
}

exports.makebooking = {

  validate: {

    payload: {
      starthour: Joi.string().required(),
      startmin: Joi.string().required(),
      endhour: Joi.string().required(),
      endmin: Joi.string().required(),
      type: Joi.string().required(),
      description: Joi.string().required(),
      room: Joi.number().integer().required(),
      date: Joi.string().required()
    },

    failAction: function (request, reply, source, error) {
      console.log('fail action request: ' + JSON.stringify(request.payload, null, 2))
      console.log('error.data.details: ' + JSON.stringify(error.data.details, null, 2))
      reply.view('bookaroom', {
        title: 'Booking error',
        date: request.payload.date,
        roomId: request.payload.room,
        errors: error.data.details
      }).code(400)
    },

    options: {
      abortEarly: false
    }
  },

  handler: (request, reply) => {
    const data = request.payload
    console.log()
    let d = new Date(data.date)
    let dstr = '' + d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)

    console.log('\nmakebooking payload: ' + JSON.stringify(data, null, 2) + '\n')
    console.log('d: ' + d)
    console.log('dstr: ' + dstr)

    let startstr = '' + data.starthour + ':' + data.startmin
    let endstr = '' + data.endhour + ':' + data.endmin

    let startError = false
    let endError = false
    let encloseError = false
    let timeOrderError = false

    let start = Date.parse(dstr + ' ' + startstr) / 1000
    let end = Date.parse(dstr + ' ' + endstr) / 1000

    console.log('start: ' + start)
    console.log('end: ' + end)

    models.Room.find({
      where: {
        id: data.room
      },
      include: [{
        model: models.Booking,
        where: { date: d }
      }]
    }).then(room => {
      // console.log('\nrooms.js 149 room: ' + JSON.stringify(room, null, 2) + '\n')
      // if room exists ie. if bookings exist for that room for that day then room will be returned; if no bookings for
      // that room then no room gets returned
      if (room) {
        async.eachSeries(room.Bookings,
            (booking, callback) => {
              timeOrderError = false
              startError = false
              endError = false
              encloseError = false
              let bStart = Date.parse(booking.start) / 1000
              let bEnd = Date.parse(booking.end) / 1000
              // if proposed start time is after proposed end time set error flag
              if (start >= end || end <= start) {
                console.log('\nError: end time precedes start time\n')
                timeOrderError = true
                console.log('\ntimeOrderError flag set\n')
              }
              // if proposed start is equal to this booking start time or between start and end time of this booking set error flag
              if (start >= bStart && start < bEnd) {
                console.log('\nbooking.start: ' + booking.start + '\n')
                startError = true
                console.log('\nstartError flag set\n')
              }
              // if proposed end is equal to this booking end or between start and end time of this booking set error flag
              if (end > bStart && end <= bEnd) {
                endError = true
                console.log('\nendError flag set\n')
              }
              if (start <= bStart && end >= bEnd) {
                encloseError = true
                console.log('\nencloseError flag set\n')
              }
              callback()
            }, (err) => {
              if (err) return err
              if (timeOrderError || startError || endError || encloseError) {
                let errors = [{message: 'Error with proposed time (' + startstr + '-' + endstr + ')'}]
                if (timeOrderError) errors.push({ message: 'Hint: start time must be earlier than end time' })
                if (startError) errors.push({ message: 'Hint: check the start time' })
                if (endError) errors.push({ message: 'Hint: check the end time' })
                if (encloseError) errors.push({ message: 'Hint: proposed booking envelops an existing booking' })
                reply.view('bookaroom', {
                  title: 'Booking error',
                  roomId: data.room,
                  date: d,
                  errors: errors
                })
              } else {
                models.Booking.create({
                  id: shortid.generate(),
                  room: data.room,
                  date: dstr,
                  start: dstr + ' ' + startstr,
                  end: dstr + ' ' + endstr,
                  type: data.type,
                  owner: request.auth.credentials.profile.email,
                  description: data.description,
                  RoomId: room.id
                }).then(result => {
                  utils.getMeetings(d, (err, roomData) => {
                    if (err) console.log(err)
                    console.log('getMeetings() roomData: ' + JSON.stringify(roomData, null, 2))
                    reply.view('meetings', {
                      date: d,
                      title: 'Scheduled meetings',
                      bookedRooms: roomData.bookedRooms,
                      rooms: roomData.returnedRooms,
                      isAdmin: request.auth.credentials.isAdmin
                    })
                  })
                }).catch(err => {
                  console.log(err)
                })
              }
            }
        )
      } else {
        timeOrderError = false
        startError = false
        endError = false
        encloseError = false
        if (start >= end || end <= start) {
          console.log('\nError: end time precedes start time\n')
          timeOrderError = true
          console.log('\ntimeOrderError flag set\n')
        }
        if (timeOrderError || startError || endError || encloseError) {
          let errors = [{message: 'Error with proposed time (' + startstr + '-' + endstr + ')'}]
          if (timeOrderError) errors.push({ message: 'Hint: start time must be earlier than end time' })
          if (startError) errors.push({ message: 'Hint: check the start time' })
          if (endError) errors.push({ message: 'Hint: check the end time' })
          if (encloseError) errors.push({ message: 'Hint: proposed booking envelops an existing booking' })
          reply.view('bookaroom', {
            title: 'Booking error',
            roomId: data.room,
            date: d,
            errors: errors
          })
        } else {
          models.Booking.create({
            id: shortid.generate(),
            room: data.room,
            date: dstr,
            start: dstr + ' ' + startstr,
            end: dstr + ' ' + endstr,
            type: data.type,
            // owner: request.auth.credentials.email,
            owner: request.auth.credentials.profile.email,
            description: data.description,
            RoomId: data.room
          }).then(() => {
            utils.getMeetings(d, (err, roomData) => {
              if (err) console.log(err)
              console.log('getMeetings() roomData: ' + JSON.stringify(roomData, null, 2))
              reply.view('meetings', {
                date: d,
                title: 'Scheduled meetings',
                bookedRooms: roomData.bookedRooms,
                rooms: roomData.returnedRooms,
                isAdmin: request.auth.credentials.isAdmin
              })
            })
          }).catch(err => {
            console.log(err)
          })
        }
      }
    })
  }
}

exports.deletebooking = {

  handler: (request, reply) => {
    let id = request.params.id
    let data = request.payload
    console.log('\ndeletebooking handler booking.id: ' + id + ', payload.room: ' + data.room + ', payload.date: ' + data.date + '\n')

    models.Booking.findById(id).then(booking => {
      return booking.destroy()
    }).then(() => {
      console.log('\nbooking deleted\n')
      reply.redirect('/home')
    }).catch(err => {
      console.log(err)
    })
  }
}
