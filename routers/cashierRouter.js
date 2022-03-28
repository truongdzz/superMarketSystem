const express = require('express');
const router = express.Router();

const cashierController = require('../controllers/cashierController');

const verifyJWT = require('../middlewares/verifyJWT');
const verifyRoles = require('../middlewares/verifyRoles');

router.use(verifyJWT, verifyRoles('cashier', 'admin'));

router.post('/checkout', cashierController.checkout);
router.get('/getUserInfo', cashierController.getUserInfo);
router.get('/getAllProduct', cashierController.getAllProduct);
router.get('/',cashierController.loadCashierPage);

module.exports = router;