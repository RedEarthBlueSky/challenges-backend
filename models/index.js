'use strict'

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../config.json');

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${config.dbhostname}:${config.dbport}/${config.dbname}`);

mongoose.connection.on('connected', function () {
  console.log(`Connected to ${config.dbname} db with Mongoose`);
});
mongoose.connection.on('error', function (err) {
  console.log(`Error connecting to ${config.dbname} with error: ${err}`);
});
mongoose.connection.on('disconnected', function () {
  console.log(`Mongoose disconnected from ${config.dbname}`);
});
