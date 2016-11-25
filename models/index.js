'use strict'

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../config.json');

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${config.dbhostname}:${config.dbport}/${config.dbname}`);

module.exports = mongoose;
