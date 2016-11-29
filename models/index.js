'use strict'

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../config.json');

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${config.dbhostname}:${config.dbport}/${config.dbname}`);

fs.readdirSync(__dirname).filter(function (file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function (file) {
  require(path.join(__dirname, file));
});


module.exports = mongoose;
