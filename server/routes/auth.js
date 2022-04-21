const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${req.decoded.drawingId}.png`);
  },
});
const upload = multer({ storage: storage });
const knex = require("knex")(require("../knexfile.js").development);
const router = express.Router();
const passport = require("passport");
require("dotenv").config();

const secretKey = process.env.SESSION_SECRET;

//Authorization middleware for viewing profile
const authorize = (req, res, next) => {
  let token = req.headers.authorization;
  let drawingId = req.headers.drawingid || "none";
  if (!token) {
    return res.status(401).json({ message: "No user" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "No user" });
    }
    req.decoded = { ...decoded, drawingId };
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
    .then((result) => {
      if (result) {
        return res.json({ success: "false" });
      }
      knex("users")
        .where("username", username)
        .first()
        .then((result) => {
          if (result) {
            return res.json({ success: "false" });
          }
          knex("users")
            .insert({
              username: username,
              google_id: "null",
              email: email,
              password: hashPass,
            })
            .then((user) => {
              if (user && bcrypt.compareSync(hashPass, password)) {
                const token = jwt.sign(
                  {
                    email: user.email,
                  },
                  secretKey
                );
                return res.json({ token });
              }
            })
            .catch((e) => console.error("Error creating a user:", e));
        });
    })
    .catch((e) => console.error("Error creating a user:", e));
});

//User profile GET request
router.get("/profile", authorize, (req, res) => {
  if (req.decoded === undefined) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let userId = "";
  let profileInfo = {};
  knex("users")
    .where("email", req.decoded.email)
    .first()
    .then((data) => {
      userId = data.user_id;
      profileInfo = {
        username: data.username,
        email: data.email,
      };
      console.log(data.user_id);
      knex("drawings")
        .where("user_id", userId)
        .select()
        .then((data) => {
          console.log(userId)
          profileInfo.drawings = data.map((drawing) => {
            return {
              thumbnail: drawing.thumbnail,
              colours: drawing.colours,
              lineart: drawing.lineart,
            };
          });
          res.json(profileInfo);
        })
    })
    .catch((e) => console.error("Error finding a profile:", e));
});

//User drawings PUT request
router.put(
  "/profile",
  authorize,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "colours", maxCount: 1 },
    { name: "lineart", maxCount: 1 },
  ]),
  (req, res) => {
    if (req.decoded === undefined) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    let userId = "";
    knex("users")
      .where("email", req.decoded.email)
      .first()
      .then((data) => {
        userId = data.id;
        knex("drawings")
          .where("id", req.decoded.drawingId)
          .then((result) => {
            if (result) {
              knex("drawings")
                .where("id", req.decoded.drawingId)
                .update({
                  user_id: userId,
                  id: req.decoded.drawingId,
                  thumbnail: `${process.env.GALLERAI_URL}/public/images/${req.files.thumbnail[0].filename}`,
                  colours: `${process.env.GALLERAI_URL}/public/images/${req.files.colours[0].filename}`,
                  lineart: `${process.env.GALLERAI_URL}/public/images/${req.files.lineart[0].filename}`,
                })
                .then(() => {
                  res.status(200).json({ saveSuccess: "true" });
                })
                .catch((e) => console.error("Error saving a drawing:", e));
              return;
            }
            knex("drawings")
              .insert({
                user_id: userId,
                id: req.decoded.drawingId,
                thumbnail: `${process.env.GALLERAI_URL}/public/images/${req.files.thumbnail[0].filename}`,
                colours: `${process.env.GALLERAI_URL}/public/images/${req.files.colours[0].filename}`,
                lineart: `${process.env.GALLERAI_URL}/public/images/${req.files.lineart[0].filename}`,
              })
              .then(() => {
                res.status(200).json({ saveSuccess: "true" });
              })
              .catch((e) => console.error("Error saving a drawing:", e));
          });
      })
      .catch((e) => console.error("Error finding a user:", e));
  }
);

//Logout GET request
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
