'use-strict'

const router = require('koa-router')();
const bodyParser = require('body-parser');

const usersCtrl = require('./controllers/users.js')
const challengesCtrl = require('./controllers/challenges.js');

router.get('/sign-in', usersCtrl.login);
router.post('/users', usersCtrl.createUser);
router.get('/me',usersCtrl.checkUser);
router.del('/me',usersCtrl.delUser);

router.get('/challenges', challengesCtrl.getChallenges);
router.post('/challenges', challengesCtrl.postChallenge);
router.get('/challenges/:id', challengesCtrl.getSpecificChallenge);
router.get('/challenges/:popularity', challengesCtrl.mostPopularChallenge);






module.exports = router;
