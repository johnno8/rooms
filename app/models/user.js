/**
 * Created by johnokeeffe on 10/03/2017.
 */
'use strict'

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: { type: DataTypes.STRING, primaryKey: true },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  })
  return User
}
