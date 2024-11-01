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
    getProducts 
} = require('../controllers/user');
const {auth, isUser, isAdmin}=require('../middlewares/auth');

router.post('/login', login);
router.post('/', createNewUser);
router.put('/update-user', auth ,updateUser);
router.patch('/add-to-cart', addToCart);
router.patch('/remove-from-cart', removeFromCart);
router.post('/search-product', searchProducts);
router.patch('/add-to-wish-list', addToWishList);
router.patch('/remove-from-wish-list', removeFromWishList);
router.get('/get-products', getProducts);
router.get('')

module.exports = router;