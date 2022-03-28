const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');

router.get('/user', logoutController.handleUserLogout);
router.get('/staff', logoutController.handleStaffLogout);

module.exports = router;