const express = require('express')
const route = express.Router()
const wareController = require('../controllers/wareController');

// jwt verify middleware
// const verifyJWT = require('../middlewares/verifyJWT');
// const verifyRoles = require('../middlewares/verifyRoles');
// route.use(verifyJWT, verifyRoles('admin'));

route.get('/updateproduct', wareController.updateproduct);
route.get('/addproduct', wareController.addproduct);
route.get('/importproduct', wareController.importproduct);
route.get('/deleteproduct/:id', wareController.deleteproduct);
route.get('/', wareController.getPage);

module.exports = route