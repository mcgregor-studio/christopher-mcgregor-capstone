const express = require("express");
const expressSession = require('express-session');
const helmet = require('helmet');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const knex = require('knex')(require('./knexfile.js').development);
const app = express();
const cors = require("cors");
require("dotenv").config();


const port = process.env.PORT || 3100;
const profileRoutes = require("./routes/profile");

//Server test to see what methods are being called at which endpoints
app.use((req, _, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

//Node libraries to ensure pages load properly
app.use(express.json());
app.use(express.static("public"));
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);
app.use(cors({
    origin: true,
    credentials: true
  }
));
app.use("/", profileRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    (_accessToken, _refreshToken, profile, done) => {
      // For our implementation we don't need access or refresh tokens.
      // Profile parameter will be the profile object we get back from GitHub
      console.log('GitHub profile:', profile);

      // First let's check if we already have this user in our DB
      knex('users')
        .select('id')
        .where({ github_id: profile.id })
        .then(user => {
          if (user.length) {
            // If user is found, pass the user object to serialize function
            done(null, user[0]);
          } else {
            // If user isn't found, we create a record
            knex('users')
              .insert({
                github_id: profile.id,
                avatar_url: profile._json.avatar_url,
                username: profile.username
              })
              .then(userId => {
                // Pass the user object to serialize function
                done(null, { id: userId[0] });
              })
              .catch(err => {
                console.error('Error creating a user', err);
              });
          }
        })
        .catch(err => {
          console.error('Error fetching a user', err);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('serializeUser (user object):', user);

  // Store only the user id in session
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  console.log('deserializeUser (user id):', userId);

  // Query user information from the database for currently authenticated user
  knex('users')
    .where({ id: userId })
    .then(user => {
      // Remember that knex will return an array of records, so we need to get a single record from it
      console.log('req.user:', user[0]);

      // The full user object will be attached to request object as `req.user`
      done(null, user[0]);
    })
    .catch(err => {
      console.log('Error finding user', err);
    });
});
