const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const knex = require("knex")(require("../knexfile.js").development);
const router = express.Router();
const passport = require("passport");
require("dotenv").config();

const secretKey = process.env.SESSION_SECRET;

//Authorization middleware for viewing profile
const authorize = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No user" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "No user" });
    }
    req.decoded = decoded;
    next();
  });
};

//Authentication GET requests
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/google/failure`,
  }),
  (_, res) => {
    res.redirect(process.env.CLIENT_URL);
  }
);

//Success callback
router.get("/google/success", (req, res) => {
  console.log(req);
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ message: "User is not logged in" });
  }
});

//Login POST request
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  knex("users")
    .where("email", email)
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign(
          {
            email: user.email,
          },
          secretKey
        );
        return res.json({ token });
      }
    })
    .catch((e) => console.error("Error fetching a user:", e));
});

//Signup POST request
router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const hashPass = bcrypt.hashSync(password, saltRounds);
  knex("users")
    .where("email", email)
    .first()
    .then((res) => {
      if (res) {
        res.json({ success: "false" });
        return;
      }
    })
    .where("username", username)
    .first()
    .then((res) => {
      if (res) {
        res.json({ success: "false" });
        return;
      }
    })
    .insert({
      username: username,
      google_id: "null",
      email: email,
      password: hashPass,
    })
    .then(() => {
      res.json({ success: "true" });
    })
    .catch((e) => console.error("Error creating a user:", e));
});

//User profile GET request
router.get("/profile", authorize, (req, res) => {
  if (req.decoded === undefined) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  knex("users")
  .where("email", req.decoded.email)
  .first()
  .then((data) => {
    const profileInfo = {
      username: data.username,
      email: data.email,
    }
    res.status(200).json(profileInfo);
  })
  .catch((e) => console.error("Error finding a profile:", e));
});

//Logout GET request
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
