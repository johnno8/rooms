require('dotenv').config()

module.exports = {
  pg: {
    name: process.env.DB_NAME || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    dialect: process.env.DIALECT || 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
}
