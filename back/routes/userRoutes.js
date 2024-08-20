const express = require('express');
const router = express.Router();
const { createNewUser, updateUser, addToCart, removeFromCart, searchProducts } = require('../controllers/user');

router.post('/new-user', createNewUser);
router.put('/update-user', updateUser);
router.patch('/add-to-cart', addToCart);
router.patch('/remove-from-cart', removeFromCart);
router.post('/search-product', searchProducts);

module.exports = router;