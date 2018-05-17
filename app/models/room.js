/**
 * Created by johnokeeffe on 10/03/2017.
 */
'use strict'

module.exports = function (sequelize, DataTypes) {
  const Room = sequelize.define('Room', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
    capacity: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Room.hasMany(models.Booking)
      }
    }
  })
  return Room
}
