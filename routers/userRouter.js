const express = require('express');
const router = express.Router();
const verifyUserJWT = require('../middlewares/verifyUserJWT');
const userController=require('../controllers/userController');
router.use(verifyUserJWT);

router.get('/category-*/',userController.buyCategory)
router.get('/',userController.buying);


module.exports = router;