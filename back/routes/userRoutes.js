const express = require('express');
const router = express.Router();
const { createNewUser, addToWishList, removeFromWishList } = require('../controllers/user');

router.post('/new-user', createNewUser);
router.patch('/add-to-wish-list', addToWishList)
router.patch('/remove-from-wish-list', removeFromWishList)

module.exports = router;