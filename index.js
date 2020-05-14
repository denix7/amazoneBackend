const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
cors = require('cors');

const configMail = require('./configMail');
const stipe = require('stripe')('pk_test_BOzSO3utMwuWZbrdpEVuqpKe00Musp6epv');

const app = express();
const config = require('./config');

//connect db
mongoose.connect( config.database, {useNewUrlParser: true, useUnifiedTopology: true}, err => {
    if(err)
        console.log(err);
    else
    {
        console.log("connected to mongoATLAS");
    }
});

mongoose.set('useCreateIndex', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(morgan('dev'));
app.use(cors());

//user routes
const userRoutes = require('./routes/account');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');

app.use('/api/accounts', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/seller/products', productRoutes);
app.use('/api', productRoutes);
app.use('/api/order', orderRoutes);

app.post('/api/email', (req, res) => {
    configMail(req.body);
    res.status(200).send({message: 'email send successfuly'});
});

app.listen(config.port, err => {
    console.log('Magic happens on port ' + config.port);
});