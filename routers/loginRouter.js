const express = require('express')
const route = express.Router()

const userController = require('../controllers/userController')
route.get('/user', userController.loginPage)
route.post('/user', userController.onLogin)

const adminController = require('../controllers/adminController')
route.get('/admin', adminController.loginPage)
route.post('/admin', adminController.onLogin)

const staffController = require('../controllers/staffController')
route.get('/staff', staffController.loginPage)
route.post('/staff', staffController.onLogin)

const cashierController = require('../controllers/cashierController')
route.get('/cashier', staffController.loginPage)
route.post('/cashier', staffController.onLogin)

module.exports = route