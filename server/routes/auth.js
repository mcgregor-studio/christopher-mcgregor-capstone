const express = require("express");
const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile.js").development);
const router = express.Router();
const passport = require("passport");
require("dotenv").config();

const secretKey = process.env.SESSION_SECRET;

//Authorization middleware for login
const authorize = (req, res, next) => {
  let auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ message: "No user" });
  }

  let tokenArr = auth.split(" ");
  let token = tokenArr[1];

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
  (_req, res) => {
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
  const { usernameEmail, password } = req.body;
  knex("users")
  .where({ username: usernameEmail } || {email: usernameEmail})
    .select()
    .then((user) => {
      if (user && user.password === password) {
        const token = jwt.sign(
          {
            name: user.name,
          },
          secretKey
        );

        return res.json({ token });
      }
    })
    .catch((e) => console.error("Error fetching a user:", e));
});

//Signup POST request
router.post('/signup', (req, res) => {
  const { username, name, password } = req.body;
  users[username] = {
    name,
    password, // NOTE: Passwords should NEVER be stored in the clear like this. Use a
    // library like bcrypt to Hash the password. For demo purposes only.
  };
  res.json({ success: 'true' });
});

//User profile GET request
router.get("/profile", (req, res) => {
  if (req.user === undefined)
    return res.status(401).json({ message: "Unauthorized" });
  res.status(200).json(req.user);
});

//Logout GET request
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
