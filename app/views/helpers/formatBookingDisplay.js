/**
 * Created by johnokeeffe on 20/04/2017.
 */
'use strict'

const moment = require('moment')

function formatBookingDisplay (context) {
  let result = ''
  console.log('hbs rooms context: ' + JSON.stringify(context, null, 2))
  if (!context.length) {
    return result + '<div class="ui one wide column">' +
                    '</div>' +
                    '<div class="ui twelve wide column">' +
                      '<div class="ui very padded text segment">' +
                        '<h3 class="ui red header">No meetings scheduled</h3>' +
                      '</div>' +
                    '</div>'
  } else if (context.length >= 1 && context.length <= 4) {
    result += '<div class="ui one wide column">' +
              '</div>'
    for (let i = 0; i < context.length; i++) {
      result += '<div class="ui three wide column">' +
                  '<table class="ui celled blue table segment">' +
                    '<thead>' +
                      '<tr>' +
                        '<h4 class="ui blue header">Room ' + context[i].id + '<br>  Capacity ' + context[i].capacity + '</h4>' +
                        '<th>' + context[i].name + '<br> Booked between</th>' +
                      '</tr>' +
                    '</thead>' +
                    '<tbody>'
      for (let j = 0; j < context[i].Bookings.length; j++) {
        result += '<tr>' +
          '<td>' + formatTime(context[i].Bookings[j].start, context[i].Bookings[j].end) + '</td>' +
          '</tr>'
      }

      result += '</tbody>' +
                  '</table>' +
                  '<form action="/details" method="POST">' +
                    '<input type="hidden" name="room" value="' + context[i].id + '">' +
                    '<input type="hidden" name="date" value="' + context[i].Bookings[0].date + '">' +
                    '<button class="ui fluid button">Details</button>' +
                  '</form>' +
                '</div>'
    }
    return result
  } else {
    for (let i = 0; i < context.length; i++) {
      result += '<div class="ui three wide column">' +
          '<table class="ui celled blue table segment">' +
          '<thead>' +
          '<tr>' +
          '<h4 class="ui blue header">Room ' + context[i].id + '<br>  Capacity ' + context[i].capacity + '</h4>' +
          '<th>' + context[i].name + '<br> Booked between</th>' +
          '</tr>' +
          '</thead>' +
          '<tbody>'
      for (let j = 0; j < context[i].Bookings.length; j++) {
        result += '<tr>' +
            '<td>' + formatTime(context[i].Bookings[j].start, context[i].Bookings[j].end) + '</td>' +
            '</tr>'
      }
      result += '</tbody>' +
          '</table>' +
          '<form action="/details" method="POST">' +
          '<input type="hidden" name="room" value="' + context[i].id + '">' +
          '<input type="hidden" name="date" value="' + context[i].Bookings[0].date + '">' +
          '<button class="ui fluid button">Details</button>' +
      '</form>' +
      '</div>'
    }
    return result
  }
}

function formatTime (start, end) {
  let result = moment(start).format('HH:mm') + '-' + moment(end).format('HH:mm')
  return result
}

module.exports = formatBookingDisplay
