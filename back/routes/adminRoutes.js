const express = require('express');
const router = express.Router();
const { 
  createProduct, 
  deleteProduct, 
  updateProduct, 
  getAllUsers, 
  deleteUser 
} = require('../controllers/admin');
const { auth, isAdmin } = require('../middlewares/auth'); // ייבוא ה-Middleware
const Product = require('../models/productSchema'); // ודא שהמודל נטען בצורה נכונה

router.post('/new-product', auth, isAdmin, createProduct);
router.delete('/products/:id', auth, isAdmin, deleteProduct);
router.patch('/update-product/:id', auth, isAdmin, updateProduct);
router.get('/users', auth, isAdmin, getAllUsers);
router.patch('/users/:id/delete', auth, isAdmin, deleteUser);

router.get('/products', auth, isAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});


module.exports = router;
