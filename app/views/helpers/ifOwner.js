/**
 * Created by johnokeeffe on 09/05/2017.
 */
'use strict'

function ifOwner (user, room, date, context) {
  if (user === context.owner) {
    return '' + '<form action="/delete/' + context.id + '" method="POST">' +
        '<input type="hidden" name="room" value="' + room.id + '">' +
        '<input type="hidden" name="date" value="' + date + '">' +
        '<button class="ui fluid submit button">Delete</button>' +
        '</form>'
  } else {
    return ''
  }
}

module.exports = ifOwner
