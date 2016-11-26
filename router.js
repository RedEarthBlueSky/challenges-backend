'use-strict'

const router = require('koa-router')();
const bodyParser = require('body-parser');

const usersCtrl = require('./controllers/users.js')
const submissionsCtrl = require('./controllers/submissions.js');
const challengesCtrl = require('./controllers/challenges.js');

router.post('/sign-in', usersCtrl.login);
router.post('/users', usersCtrl.createUser);
router.get('/users/:notification', usersCtrl.notifications);
router.get('/me',usersCtrl.checkUser);
router.del('/me',usersCtrl.delUser);

router.get('submissions/:feed', submissionsCtrl.getFeed);
router.post('/submission', submissionsCtrl.postSubmission);
router.get('/submissions/:id', submissionsCtrl.getSpecificSubmission);
router.get('/submissions/:self', submissionsCtrl.getSelfSubmissions);

router.get('/challenges', challengesCtrl.getChallenges);
router.post('/challenges', challengesCtrl.postChallenge);
router.get('/challenges/:id', challengesCtrl.getSpecificChallenge);
router.get('/challenges/:popularity', challengesCtrl.mostPopularChallenge);

module.exports = router;
