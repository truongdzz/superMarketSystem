const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/user', authController.handleLoginUser);
router.post('/staff', authController.handleLoginStaff);
router.get('/staff', authController.loadStaffLoginPage);
router.get('/user', authController.loadUserLoginPage);

module.exports = router;