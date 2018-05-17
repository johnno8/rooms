/**
 * Created by johnokeeffe on 27/03/2017.
 */
'use strict'

const moment = require('moment')

function formatBookingTime (context) {
  console.log('fBT context: ' + JSON.stringify(context, null, 2))
  let start = moment(context.start)
  let end = moment(context.end)

  // if (start.isDST()) { // check for Daylight Saving Time
  //   start.subtract(1, 'h')
  //   end.subtract(1, 'h')
  // }
  let result = start.format('HH:mm') + '-' + end.format('HH:mm')
  return result
}

module.exports = formatBookingTime
