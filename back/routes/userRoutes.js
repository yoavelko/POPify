const express = require('express');
const router = express.Router();

const { createNewUser, updateUser, addToCart, removeFromCart, searchProducts, addToWishList, removeFromWishList, getProducts } = require('../controllers/user');

router.post('/new-user', createNewUser);
router.put('/update-user', updateUser);
router.patch('/add-to-cart', addToCart);
router.patch('/remove-from-cart', removeFromCart);
router.post('/search-product', searchProducts);
router.patch('/add-to-wish-list', addToWishList);
router.patch('/remove-from-wish-list', removeFromWishList);
router.get('/get-products', getProducts);

module.exports = router;