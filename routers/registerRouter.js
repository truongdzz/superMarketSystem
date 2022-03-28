const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');


router.post('/staff', registerController.handleNewStaff);
router.post('/user', registerController.handleNewUser);
router.get('/user', registerController.loadUserRegisterPage);
router.get('/staff', registerController.loadStaffRegisterPage);

module.exports = router;