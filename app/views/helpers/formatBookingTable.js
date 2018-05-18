'use strict'

function formatBookingTable (rooms) {
  let times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']
  let bookingsExist = false

  for (let i = 0; i < rooms.length; i++) {
    rooms[i].booked = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]

    if (rooms[i].Bookings) {
      bookingsExist = true
      for (let j = 0; j < rooms[i].Bookings.length; j++) {
        let start = rooms[i].Bookings[j].start.toString().slice(16, 21)
        let end = rooms[i].Bookings[j].end.toString().slice(16, 21)
        // console.log('start: ' + start)
        // console.log('end: ' + end)
        let startIndex = times.indexOf(start)
        let endIndex = times.indexOf(end)
        let numSlots = endIndex - startIndex
        // console.log('startIndex: ' + startIndex + ', endIndex: ' + endIndex + ', numSlots: ' + numSlots)
        for (let k = startIndex; k < startIndex + numSlots; k++) {
          rooms[i].booked[k] = true
        }
      }
    }
  }

  // console.log('rooms from formatBookingTable: ' + JSON.stringify(rooms, null, 2))
  const slots = ['09.00 - 09.30', '09.30 - 10.00', '10.00 - 10.30', '10.30 - 11.00', '11.00 - 11.30', '11.30 - 12.00', '12.00 - 12.30', '12.30 - 13.00', '13.00 - 13.30',
    '13.30 - 14.00', '14.00 - 14.30', '14.30 - 15.00', '15.00 - 15.30', '15.30 - 16.00', '16.00 - 16.30', '16.30 - 17.00', '17.00 - 17.30', '17.30 - 18.00']
  let tableHtml = ''

  if (bookingsExist) {
    tableHtml += '<table class="ui celled blue definition table segment">' +
        '<thead>' +
        '<tr>' + '<th></th>'
    for (let i = 0; i < rooms.length; i++) {
      tableHtml += '<th style="text-align: center">' + rooms[i].name + '</th>'
    }

    tableHtml += '</tr>' +
        '</thead>' +
        '<tbody>'

    for (let j = 0; j < slots.length; j++) {
      tableHtml += '<tr>'
      tableHtml += '<td>' + slots[j] + '</td>'
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].booked[j]) {
          tableHtml += '<td class="booked">' + '</td>'
        } else {
          tableHtml += '<td>' + '</td>'
        }
      }
      tableHtml += '</tr>'
    }

    tableHtml += '<tr>' +
        '<td>' + '</td>'
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].Bookings) {
        tableHtml += '<td>' +
            '<form action="/details" method="POST">' +
            '<input type="hidden" name="room" value="' + rooms[i].id + '">' +
            '<input type="hidden" name="date" value="' + rooms[i].Bookings[0].date + '">' +
            '<button class="ui fluid button">Details</button>' +
            '</form>' +
            '</td>'
      } else {
        tableHtml += '<td>' + '</td>'
      }
    }

    tableHtml += '</tr>' +
        '</tbody>' +
        '</table>'
  } else {
    tableHtml += '<div class="ui grid">' +
        '<div class="ui one wide column">' +
        '</div>' +
        '<div class="ui fourteen wide column">' +
        '<div class="ui very padded text segment">' +
        '<h3 class="ui red header">No meetings scheduled</h3>' +
        '</div>' +
        '</div>' +
        '</div>'
  }

  return tableHtml
}

module.exports = formatBookingTable
