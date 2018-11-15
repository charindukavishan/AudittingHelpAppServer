const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const connection=require('../models/db')
var User = mongoose.model('User');

passport.use(
    new localStrategy({ usernameField: 'email' },
        (username, password, done) => 

    
    {
        
    connection.query('SELECT * FROM users WHERE email = ?',username, function (error, results, fields) {
        if (error)
                        return done(error);
                    // unknown user
                    else if (!results)
                        return done(null, false, { message: 'Email is not registered' });
                    // wrong password
                    else if (results[0].password!=password)
                        return done(null, false, { message: 'Wrong password.' });
                    // authentication succeeded
                    else
                        return done(null, results[0]);
      });
  
    }
    
    )



);