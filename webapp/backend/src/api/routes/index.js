/**
 * @file router.js
 * @description This file contains root lavel routing rules
 * @author Arkadip Bhattacharya(@darkmatter18)
 */

const express = require('express');
const dataRouter = require('./data.route')

const router = express.Router();

router.get('/status', (req, res)=> res.send("OK! I'm live"));

/**
 * Adding router
 * @prefix /api
 */
router.use('/data', dataRouter)

module.exports = router;