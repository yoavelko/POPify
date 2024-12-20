const express = require('express');
const router = express.Router();

const { 
    login,
    createNewUser, 
    updateUser, 
    addToCart, 
    removeFromCart, 
    searchProducts, 
    addToWishList, 
    removeFromWishList, 
    getProducts, 
    getCart,
    getProductsByCategory,
    getWishlist,
    postTweet
} = require('../controllers/user');

router.post('/login', login);
router.post('/', createNewUser);
router.put('/update-user', updateUser);
router.patch('/add-to-cart', addToCart);
router.patch('/remove-from-cart', removeFromCart);
router.post('/search-product', searchProducts);
router.patch('/add-to-wish-list', addToWishList);
router.patch('/remove-from-wish-list', removeFromWishList);
router.get('/get-products', getProducts);
router.get('/getProductsByCategory', getProductsByCategory);
router.get('/:userId/cart', getCart);
router.get('/:userId/wishlist', getWishlist);
router.post('/tweet', postTweet);

module.exports = router;