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
    }
}