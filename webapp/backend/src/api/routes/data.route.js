const express = require('express');

const controllers = require('../controllers/data.controller')

const router = express.Router();

router.route('/latest').get(controllers.getLatestValue);


/**
 * @api {post} /api/auth/login
 * @apiDescription Login verify and get an accessToken
 * @apiName Login
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}         email     User's email
 * @apiParam  {String{..128}}  password  User's password
 * 
 * @apiSucess On API Success, Reponse:
 * @apiSuccess  {String}  token.tokenType     Access Token's type
 * @apiSuccess  {String}  token.accessToken   Authorization Token
 * @apiSuccess  {String}  token.refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess  {Number}  token.expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiSuccess  {String}  user.id             User's id
 * @apiSuccess  {String}  user.name           User's name
 * @apiSuccess  {String}  user.email          User's email
 * @apiSuccess  {String}  user.role           User's role
 * @apiSuccess  {Date}    user.createdAt      Timestamp
 *
 * @apiError On API Error, Response:
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or password
 */
// router.route('/login').post(validate(login), controllers.login);

/**
 * @api {post} /api/auth/refresh-token
 * @apiDescription Refresh expired accessToken
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  email         User's email
 * @apiParam  {String}  refreshToken  Refresh token aquired when user logged in
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
 */
// router.route('/refresh').post(validate(refresh), controllers.refresh);

// router.route('/send-password-reset').post(validate(sendPasswordReset), controllers.sendPasswordReset);

// router.route('/reset-password').post(validate(passwordReset), controllers.resetPassword);

module.exports = router