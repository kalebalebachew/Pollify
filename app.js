const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
const path = require('path');

const User = require('./models/UserModel'); 

mongoose.connect('mongodb://localhost:27017/your-database-name', { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs'); 
app.use(express.urlencoded({ extended: true }));



//-----------------------------------user-routes---------------------------------------------------

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Signup route
app.post('/sign-up', async (req, res, next) => {
  try {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });
    const result = await newUser.save();
    res.redirect('/');
  } catch (error) {
    return next(error);
  }
});

// Login route
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
  })
);




//poll routes 






















app.listen(3000, (err) => {
  if (err) {
    console.error('Failed to connect to the server:', err);
  } else {
    console.log('Server is listening on port 3000');
  }
});
