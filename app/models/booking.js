/**
 * Created by johnokeeffe on 13/03/2017.
 */
'use strict'

module.exports = function (sequelize, DataTypes) {
  const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.STRING, primaryKey: true },
    room: DataTypes.INTEGER,
    date: DataTypes.DATE,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    type: DataTypes.STRING,
    owner: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Booking.belongsTo(models.Room)
      }
    }
  })
  return Booking
}
