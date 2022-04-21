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
const authRoutes = require("./routes/auth");

//Server test to see what methods are being called at which endpoints
app.use((req, _, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

//Node libraries to ensure pages load properly
app.use(express.json({limit: "50mb"}));
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
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      /* User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      }); */

      knex("users")
        .select("id")
        .where({ google_id: profile.id })
        .then((user) => {
          if (user.length) {
            done(null, user[0]);
          } else {
            knex("users")
              .insert({
                google_id: profile.id,
                username: profile.displayName,
                email: profile.email
              })
              .then((userId) => {
                done(null, { id: userId[0] });
              })
              .catch((e) => console.error("Error creating a user:", e));
          }
        })
        .catch((e) => console.error("Error fetching a user:", e));
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializeUser (user object):", user);
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  console.log("deserializeUser (user id):", userId);
  knex("users")
    .where({ id: userId })
    .then((user) => {
      console.log("req.user:", user[0]);
      done(null, user[0]);
    })
    .catch((err) => {
      console.error("Error finding user", err);
    });
});
