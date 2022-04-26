const express = require('express');
const route = express.Router();
const staffController = require('../controllers/staffController.js');

const verifyJWT = require('../middlewares/verifyJWT');
const verifyRoles = require('../middlewares/verifyRoles');
route.use(verifyJWT, verifyRoles('admin', 'cashier', 'Ware'));

route.delete('/deleteSchedule', staffController.deleteSchedule);
route.post('/registSchedule', staffController.registSchedule);
route.get('/editProfile', staffController.loadEditProfile);
route.post('/updateProfile', staffController.updateProfile);
route.post('/updatePassword', staffController.updatePassword);

module.exports = route;