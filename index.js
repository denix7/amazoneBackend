const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
cors = require('cors');

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
app.use('/api/accounts', userRoutes);

app.listen(config.port, err => {
    console.log('Magic happens on port ' + config.port);
});