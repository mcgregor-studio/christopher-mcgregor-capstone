const express = require("express");
const expressSession = require("express-session");
const helmet = require("helmet");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const knex = require("knex")(require("./knexfile.js").development);
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
    saveUninitialized: true,
  })
);
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use("/", profileRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://yourdomain:3000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializeUser (user object):", user);
  // Store only the user id in session
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  console.log("deserializeUser (user id):", userId);
  // Query user information from the database for currently authenticated user
  knex("users")
    .where({ id: userId })
    .then((user) => {
      // Remember that knex will return an array of records, so we need to get a single record from it
      console.log("req.user:", user[0]);

      // The full user object will be attached to request object as `req.user`
      done(null, user[0]);
    })
    .catch((err) => {
      console.error("Error finding user", err);
    });
});
