'use strict';

const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const passport = require('koa-passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const bcrypt = require('bcrypt');

const config = require('./config.json');
const router = require('./router.js');
const db = require('./models');

const app = koa();

app.use(cors());
app.use(bodyParser());
// app.use(router.routes());

app.use( function *() {
  this.body = 'We have some challenges for you!';
});

app.listen(config.port, function () {
  console.log('Challenges server listening on port ' + config.port);
});
