const express = require("express");
const eSession = require("express-session");
const sessionStore = require("connect-session-knex")(eSession);
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const knex = require("knex")(require("./knexfile.js").production);
const app = express();
require("dotenv").config();

//Establishing routes, store and connection
const port = process.env.PORT;
const store = new sessionStore();

console.log(process.env)
//Server test to see what methods are being called at which endpoints
//Header added to allow images to be written to the canvas without tainting it
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  res.header("access-control-allow-origin", process.env.REACT_APP_URL);
  next();
});

//Node libraries to ensure pages load properly
app.use(express.json({ limit: "250mb" }));
app.use(express.static("public"));
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: "access-control-allow-origin",
  })
);
app.use(
  eSession({
    store: store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: {
      sameSite: "none",
      secure: true
    }
  })
);

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
    function (_request, _accessToken, _refreshToken, profile, done) {
      knex("users")
        .select("g_id")
        .where({ g_id: profile.id })
        .then((user) => {
          if (user.length) {
            return done(null, user[0]);
          } else {
            knex("users")
              .insert({
                g_id: profile.id,
                username: profile.name.givenName,
              })
              .then(() => {
                return done(null, {
                  g_id: profile.id,
                  username: profile.name.givenName,
                });
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
  return done(null, user.g_id);
});

passport.deserializeUser((userId, done) => {
  console.log("deserializeUser (user id):", userId);
  knex("users")
    .where({ g_id: userId })
    .then((user) => {
      console.log("req.user:", user[0]);
      return done(null, user[0]);
    })
    .catch((err) => {
      console.error("Error finding user", err);
    });
});

//Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});