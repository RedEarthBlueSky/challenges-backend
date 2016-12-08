'use-strict'

const router = require('koa-router')();
const bodyParser = require('body-parser');

const usersCtrl = require('./controllers/users.js');
const submissionsCtrl = require('./controllers/submissions.js');
const challengesCtrl = require('./controllers/challenges.js');
const s3Ctrl = require('./controllers/s3.js');
const populateCtrl = require('./controllers/populate-db.js');

router.post('/sign-in/facebook', usersCtrl.login);
router.get('/users/:notification', usersCtrl.notifications);
router.post('/me',usersCtrl.checkUser);

router.post('/submission', submissionsCtrl.postSubmission);
router.get('/submissions/:id', submissionsCtrl.getSpecificSubmission);
router.get('/submissions/self', submissionsCtrl.getSelfSubmissions);
router.get('/submissions/challenge/:id', submissionsCtrl.getLatestSubmissions);

router.get('/challenges', challengesCtrl.getChallenges);
router.post('/challenges', challengesCtrl.postChallenge);
router.get('/challenges/:id', challengesCtrl.getSpecificChallenge);

router.post('/videos/upload', s3Ctrl.uploadFile);

router.post('/populatedb', populateCtrl.populateDb);

module.exports = router;
