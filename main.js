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
const User = require('./models').models.User;

const app = koa();

app.use(cors());
app.use(bodyParser());
app.use(router.routes());

//  ADD passport middleware for challenges POST
passport.use(new BearerStrategy(
  function (authToken, done) {
    console.log(authToken);
    User.findOne({ authToken: authToken }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, {scope: 'all'});
    });
  }
));

app.use(passport.initialize());
app.use(passport.session());

app.use( function *() {
  this.body = 'We have some challenges for you!';
})

db.connection.on('error', (err) => {
  console.log(`Error connecting to ${config.dbname} with error: ${err}`);
})

db.connection.once('open', () => {
  console.log(`Connected to ${config.dbname} db with Mongoose`);
  app.listen(config.port, () => {
    console.log(`Challenges server listening on port ${config.port}`);
  });
})

db.connection.on('disconnected', () => {
  console.log(`Mongoose disconnected from ${config.dbname}`);
})
