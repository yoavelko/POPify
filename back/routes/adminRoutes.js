const express = require('express');
const router = express.Router();
const { createProduct, deleteProduct, updateProduct, getAllUsers, deleteUser } = require('../controllers/admin');

router.post('/new-product', createProduct);
router.post('/delete-product', deleteProduct);
router.patch('/update-product', updateProduct);
router.get('/get-all-users', getAllUsers);
router.patch('/delete-user', deleteUser);

module.exports = router;