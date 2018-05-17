/**
 * Created by johnokeeffe on 10/04/2017.
 */
'use strict'

function formatRoomName (context) {
  let roomNameDisplay
  if (context === 40) roomNameDisplay = ' Book the Boardroom'
  else if (context === 36) roomNameDisplay = 'Book Headquarters'
  else if (context === 4) roomNameDisplay = 'Book the Finance Room'
  else if (context === 1) roomNameDisplay = 'Book Call Booth 1'
  else if (context === 2) roomNameDisplay = 'Book Call Booth 2'
  return roomNameDisplay
}

module.exports = formatRoomName
