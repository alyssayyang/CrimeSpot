const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users')
const {isLoggedIn} = require('../middleware');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, keepSessionInfo: true, failureRedirect: '/login'}), users.login);

router.get('/logout', users.logout);

router.get('/profile',isLoggedIn,catchAsync(users.renderProfile));
router.get('/editprofile',isLoggedIn,catchAsync(users.renderEditProfile));
router.post('/editprofile',isLoggedIn,catchAsync(users.updateProfile));

module.exports = router;