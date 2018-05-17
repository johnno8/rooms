/**
 * Created by johnokeeffe on 28/03/2017.
 */
'use strict'

const moment = require('moment')

function displayDate (context) {
  let d = moment(context)
  return d.format('dddd, MMMM Do YYYY')
}

module.exports = displayDate
