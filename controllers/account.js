var User = require('../models/user');
var config = require('../config');
var jwt = require('jsonwebtoken');

module.exports = 
{
    home: function(req, res)
    {
        res.status(200).send({message: 'User its works'});
    },

    saveUser: function(req, res, next)
    {
        let user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;
        user.image = user.gravatar();
        user.isSeller = req.body.isSeller;

        User.findOne({email: req.body.email.toLowerCase()}, (err, userStored) => {
            if(userStored)
            {
                res.json({
                    success: false,
                    message: 'Account whit that email is already exist'
                });
            }
            else
            {
                user.save();

                var token = jwt.sign({user: user}, config.secret, {expiresIn: '7d'});

                res.json({
                    success: true,
                    message: 'Enjoy your tokken',
                    token: token
                });
            }
        });
    },

    loginUser: function(req, res, next)
    {
        User.findOne({email: req.body.email}, (err, user) => {
            if(err)
                throw err;

            else if(!user)
                res.json({success: false, message: 'Authenticated failed, user not found'});

            else if(user)
            {
                var validPassword = user.comparePassword(req.body.password);
                if(!validPassword)
                {
                    res.json({success: false, message: 'Authenticated failed, invalid password'});
                }    
                else
                {
                    var token = jwt.sign({user:user}, config.secret, {expiresIn: '7d'});
                    res.json({success: true, message: "User login!", token: token});
                }
            }   
        });
    },

    getProfile: function(req, res, next)
    {
        User.find({_id: req.decoded.user._id}, (err, user) => {
            if(err)
                throw err;
            res.json({success: true, message: "Successful", user});
        });
    },

    updateProfile: function(req, res, next)
    {
        User.findOne({_id: req.decoded.user._id}, (err, user) => {
            if(err)
                return next(err);
            
            if(req.body.name) user.name = req.body.name;
            if(req.body.email) user.email = req.body.email;
            if(req.body.email) user.password = req.body.password;

            user.isSeller = req.body.isSeller;

            user.save();
            res.json({
                success: true,
                message: 'Profile edited successfully'
            });
        });
    },

    getAddress: function(req, res, next)
    { 
        User.findOne({_id : req.decoded.user._id}, (err, user) => {
            if(err) 
                return next(err);
            console.log(user);
            res.json({success: true, message: 'Successful', address: user.address});
        })
    },

    updateAddress: function(req, res, next)
    {
        User.findOne({_id: req.decoded.user._id}, (err, user) => {
            if(err) 
                return next(err);
            console.log(user);
            console.log(user.address);
            if(req.body.addr1) user.address.addr1 = req.body.addr1;
            if(req.body.addr2) user.address.addr2 = req.body.addr2;
            if(req.body.city) user.address.city = req.body.city;
            if(req.body.telephone1) user.address.telephone1 = req.body.telephone1;
            if(req.body.telephone2) user.address.telephone2 = req.body.telephone2;
            if(req.body.state) user.address.state = req.body.state;
            if(req.body.postalCode) user.address.postalCode = req.body.postalCode;

            user.save();
            res.json({success: true, message: 'Address edited succesfully', address: user.address})
        });
    }
}