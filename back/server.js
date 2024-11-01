const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoutes');
const adminRoute = require('./routes/adminRoutes');
const orderRoute = require('./routes/orderRoutes');
const twitterRoutes = require('./routes/twitterRoutes');
const { auth, isAdmin } = require('./middlewares/auth'); // ייבוא ה-Middleware

mongoose.connect('mongodb+srv://yoavelkobi889:iVpnI4KHCxbmPS0M@cluster0.tkogcco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {})
  .then(() => console.log('Connected to mongoDB'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

// הגנה על נתיבי /admin
app.use('/admin', auth, isAdmin, adminRoute); 

// נתיבים אחרים
app.use('/user', userRoute);
app.use('/order', orderRoute);
app.use('/api', twitterRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Hello world');
});

app.listen(3001, () => {
  console.log('server is alive');
});
