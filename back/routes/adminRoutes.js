const express = require('express');
const router = express.Router();

const { 
  createProduct, 
  deleteProduct, 
  updateProduct, 
  getAllUsers, 
  deleteUser 
} = require('../controllers/admin');
const Product = require('../models/productSchema'); // ודא שהמודל נטען בצורה נכונה

router.post('/new-product', createProduct);
router.delete('/products/:id', deleteProduct);
router.patch('/update-product/:id', updateProduct);
router.get('/users', getAllUsers);
router.patch('/users/:id/delete', deleteUser);

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});


module.exports = router;
