const express = require('express')
const route = express.Router()
const adminController = require('../controllers/adminController');

//jwt verify middleware
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRoles = require('../middlewares/verifyRoles');
route.use(verifyJWT, verifyRoles('admin'));


route.get('/deleteSchedule', adminController.deleteSchedule);
route.get('/changeSchedule', adminController.changeSchedule);
route.get('/addSchedule', adminController.addSchedule);
route.put('/changeOrderStatus', adminController.changeOrderStatus);
route.get('/getSchedule', adminController.getSchedule);
route.get('/getAllProduct', adminController.getAllProduct);
route.get('/getYearData/:id', adminController.getYearData);
route.get('/getMonthData/:id', adminController.getMonthData);
route.get('/getWeekData/:id', adminController.getWeekData);
route.put('/updateBuyPrice/:id/:value', adminController.updateBuyPrice);
route.put('/updateDiscount/:id/:value', adminController.updateDiscount);
route.put('/updateSellPrice/:id/:value', adminController.updateProductPrice);
route.get('/detailProduct/:id', adminController.loadDetailProduct);
route.get('/detailOrder/:id', adminController.loadDetailOrder);
route.get('/leadCategory', adminController.getLeadCategory);
route.get('/editstaff/:staffid', adminController.editStaff); ///////////
route.get('/updatestaff/:staffid', adminController.updateStaff);
route.get('/deletestaff/:staffid', adminController.deleteStaff);
route.get('/searchstaff/', adminController.searchStaff);
route.post('/sendnoti/', adminController.sendNoti);
route.get('/sendnoti/', adminController.viewNoti);
route.get('/getnoti/:notiid', adminController.getNoti); /////////////
route.get('/leadProduct', adminController.getLeadProduct);
route.get('/businessStatistic', adminController.getBuyAndSaleDataByTime);
route.get('/statistic', adminController.loadStatisticPage);
route.get('/staffmanager', adminController.getStaffManager);
route.get('/shiftmanager', adminController.getShiftManager);
route.get('/hourstatistic', adminController.getHourStatistic);
route.get('/',adminController.loadDashboard);

module.exports = route