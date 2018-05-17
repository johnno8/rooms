/**
 * Created by johnokeeffe on 10/03/2017.
 */
'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../../config')
// var env       = process.env.NODE_ENV || "development";
// var config    = require(__dirname + '/../config/config.json')[env];

// const sequelize = new Sequelize('testdb', 'postgres', 'rG6RdDHW', {
// const sequelize = new Sequelize('meeting-room-db', 'postgres', 'postgres', {
// const sequelize = new Sequelize('roomschedulerdb', 'rsMasterUser', 'oryxforecabin', {

/*
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.PG_HOST || 'localhost',
  // dialect: 'mysql' | 'mariadb' | 'sqlite' | 'postgres' | 'mssql',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
}) */
if (process.env.DATABASE_URL) {
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     match[4],
    host:     match[3],
    logging:  true //false
  })
} else {
  const sequelize = new Sequelize(config.pg.name, config.pg.user, config.pg.password, {
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
