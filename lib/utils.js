'use strict'
const models = require('../app/models')
const async = require('async')

const getDate = () => {
  let d = new Date()
  let t = '' + d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)
  let today = new Date(t)

  return today
}

const getMeetings = (date, callback) => {
  console.log('date from getMeetings: ' + date)
  let allRooms = []

  models.Room.findAll({}).then(returnedRooms => {
    allRooms = returnedRooms
    console.log('returnedRooms from getMeetings(): ' + JSON.stringify(returnedRooms, null, 2))
  }).then(() => {
    models.Room.findAll({
      include: [{
        model: models.Booking,
        where: {date: date}
      }]
    }).then(bookedRooms => {
      console.log('bookedRooms from getMeetings(): ' + JSON.stringify(bookedRooms, null, 2))
      async.eachSeries(bookedRooms,
          (bookedRoom, callback) => {
            bookedRoom.Bookings = bookedRoom.Bookings.sort((a, b) => {
              return a.start - b.start
            })
            callback()
          }, err => {
            if (err) return err
            for (let i = 0; i < bookedRooms.length; i++) {
              for (let j = 0; j < allRooms.length; j++) {
                if (allRooms[j].id === bookedRooms[i].id) {
                  allRooms[j] = bookedRooms[i]
                }
              }
            }
            callback(null, allRooms)
          }
      )
    })
  }).catch(err => {
    console.log('err from getMeetings(): ' + err)
    callback(err)
  })
}

module.exports = { getDate, getMeetings }
