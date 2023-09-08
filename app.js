const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');

const User = require('./models/UserModel');
const Poll = require('./models/PollModel');

mongoose.connect('mongodb://127.0.0.1:27017/Pollify', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

//-----------------------------------user-routes---------------------------------------------------

// passport configuration
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

//------------------------poll routes ---------------------------------------------

// Route to render the home page
app.get('/', async (req, res, next) => {
  try {
    const polls = await Poll.find(); // Fetch polls from your database or wherever you store them
    res.render('home', { polls });
  } catch (error) {
    return next(error);
  }
});

// Route to handle the poll creation form submission
app.post('/create-poll', async (req, res, next) => {
  try {
    const { question, options } = req.body;
    const initialVotes = Array(options.split(',').length).fill(0); // Initialize votes with zeros
    const newPoll = new Poll({
      question,
      options: options.split(',').map(option => option.trim()),
      votes: initialVotes, // Set the initial votes
    });
    const result = await newPoll.save();
    res.redirect('/');
  } catch (error) {
    return next(error);
  }
});

app.post('/vote/:pollId', async (req, res, next) => {
  try {
    const pollId = req.params.pollId;
    const selectedOption = req.body.selectedOption;
    
    // Find the poll by ID
    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).send('Poll not found');
    }

    // Find the index of the selected option and increment its vote count
    const optionIndex = poll.options.indexOf(selectedOption);
    if (optionIndex !== -1) {
      // Increment the vote count for the selected option
      poll.votes[optionIndex]++;
      await poll.save();
    }

    res.redirect('/');
  } catch (error) {
    return next(error);
  }
});







app.listen(4000, (err) => {
  if (err) {
    console.error('Failed to connect to the server:', err);
  } else {
    console.log('Server is listening on port 4000');
  }
});
