const express     = require('express');
const router      = express.Router();
const orderCtrl   = require('../controllers/orderCtrl');

router.get('/',       orderCtrl.getAllOrders);
router.get('/:id',    orderCtrl.getOrderById);
router.post('/',      orderCtrl.createOrder);
router.put('/:id',    orderCtrl.updateOrder);

module.exports = router;