/**
 * @file vars.js
 * @description This file contains all environment variables and exports that as an object
 * @author Arkadip Bhattacharya(@darkmatter18)
 */


module.exports = {
  env: process.env.NODE_ENV,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  mongo: {
    uri: process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI,
  },
  port: process.env.PORT || 8080
}