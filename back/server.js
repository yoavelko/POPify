const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoutes');
const adminRoute = require('./routes/adminRoutes');
const orderRoute = require('./routes/orderRoutes');


mongoose.connect('mongodb+srv://yoavelkobi889:iVpnI4KHCxbmPS0M@cluster0.tkogcco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {})
    .then(() => console.log('Connected to mongoDB'))
    .catch(err => console.log(err))

app.use('/user', userRoute);
app.use('/admin', adminRoute);
app.use('/order', orderRoute);


app.get('/', (req, res) => {
    res.status(200).send('Hello world')
})

app.listen(3001, () => {console.log('server is alive')});