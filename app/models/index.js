/**
 * Created by johnokeeffe on 10/03/2017.
 */
'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../../config')

let sequelize
if (process.env.DATABASE_URL) {
  console.log('inside if (process.env.DATABASE_URL)')
  sequelize = new Sequelize(process.env.DATABASE_URL)
} else {
  console.log('inside if (process.env.DATABASE_URL) else')
  sequelize = new Sequelize(config.pg.name, config.pg.user, config.pg.password, {
    host: config.pg.host,
    dialect: config.pg.dialect,
    pool: config.pg.pool
  })
}

let db = {}

fs
    .readdirSync(__dirname)
    .filter(function (file) {
      return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach(function (file) {
      let model = sequelize['import'](path.join(__dirname, file))
      db[model.name] = model
    })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
