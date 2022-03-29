const express = require('express')
const route = express.Router()
const adminController = require('../controllers/adminController');

//jwt verify middleware
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRoles = require('../middlewares/verifyRoles');
route.use(verifyJWT, verifyRoles('admin'));

route.get('/leadCategory', adminController.getLeadCategory);
route.get('/leadProduct', adminController.getLeadProduct);
route.get('/businessStatistic', adminController.getBuyAndSaleDataByTime);
route.get('/statistic', adminController.loadStatisticPage);
route.get('/staffmanager', adminController.getStaffManager);
route.get('/shiftmanager', adminController.getShiftManager);
route.get('/hourstatistic', adminController.getHourStatistic);
route.get('/',adminController.loadDashboard);

module.exports = route