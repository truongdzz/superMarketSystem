const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController');

router.get('/user', refreshTokenController.handleUserRefreshToken);
router.get('/staff', refreshTokenController.handleStaffRefreshToken);

module.exports = router;