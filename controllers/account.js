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
        // user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;
        // user.picture = user.gravatar();
        // user.isSeller = req.body.isSeller;

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
    }
}