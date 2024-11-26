const express = require('express');
const router = express.Router();
const { createOrder, getProductsWithPopularity, getOrder, getUserOrders, getOrdersPerCustomer, getAllOrders, updateOrderStatus, getOrdersPerCustomerStatistics } = require('../controllers/order');

// נתיב ליצירת הזמנה חדשה
router.post('/', createOrder);

// נתיב לקבלת הזמנה לפי מזהה
router.get('/get-order', getOrder);

// נתיב למוצרים עם פופולריות
router.get('/with-popularity', getProductsWithPopularity);

router.get('/user-orders', getUserOrders);

router.get('/:userId/orders-per-customer', getOrdersPerCustomer);

router.get('/get-all-orders', getAllOrders);

router.patch('/update-status', updateOrderStatus);

router.get('/orders-statistics', getOrdersPerCustomerStatistics);

module.exports = router;
