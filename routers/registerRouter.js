const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const verifyJWT = require('../middlewares/verifyJWT')
const verifyRoles = require('../middlewares/verifyRoles')


router.post('/user', registerController.handleNewUser);
router.get('/user', registerController.loadUserRegisterPage);

router.use(verifyJWT, verifyRoles('admin'))

router.post('/staff', registerController.handleNewStaff);
router.get('/staff', registerController.loadStaffRegisterPage);

module.exports = router;