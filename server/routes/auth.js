const express = require("express");
const fs = require("fs");
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
      userId = data.id;
      profileInfo = {
        username: data.username,
      };
      knex("drawings")
        .where("user_id", userId)
        .select()
        .then((data) => {
          profileInfo.drawings = data.map((drawing) => {
            return {
              id: drawing.id,
              thumbnail: drawing.thumbnail,
            };
          });
          res.status(200).json(profileInfo);
        });
    })
    .catch((e) => console.error("Error finding a profile:", e));
});

//User drawing GET request
router.get("/profile/:drawingId", authorize, (req, res) => {
  if (req.decoded === undefined) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let drawingInfo = {};
  knex("drawings")
    .where("id", req.decoded.drawingId)
    .select()
    .then((data) => {
      if (!data[0]) {
        return res.status(205).json({ message: "Reset canvas" });
      }
      drawingInfo.id = data[0].id;
      drawingInfo.lineart = data[0].lineart;
      drawingInfo.colours = data[0].colours;
      res.status(200).json(drawingInfo);
    })
    .catch((e) => console.error("Error finding a profile:", e));
});

//User drawing PUT request
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
          .where("user_id", userId)
          .then((result) => {
            if (result.length <= 11) {
              knex("drawings")
                .where("id", req.decoded.drawingId)
                .then((result) => {
                  if (!result[0]) {
                    knex("drawings")
                      .insert({
                        user_id: userId,
                        id: req.decoded.drawingId,
                        thumbnail: `${process.env.GALLERAI_URL}/images/${req.files.thumbnail[0].filename}`,
                        colours: `${process.env.GALLERAI_URL}/images/${req.files.colours[0].filename}`,
                        lineart: `${process.env.GALLERAI_URL}/images/${req.files.lineart[0].filename}`,
                      })
                      .then(() => {
                        res.status(200).json({ saveSuccess: "true" });
                      })
                      .catch((e) =>
                        console.error("Error saving a drawing:", e)
                      );
                    return;
                  }

                  knex("drawings")
                    .where("id", req.decoded.drawingId)
                    .update({
                      user_id: userId,
                      id: req.decoded.drawingId,
                      thumbnail: `${process.env.GALLERAI_URL}/images/${req.files.thumbnail[0].filename}`,
                      colours: `${process.env.GALLERAI_URL}/images/${req.files.colours[0].filename}`,
                      lineart: `${process.env.GALLERAI_URL}/images/${req.files.lineart[0].filename}`,
                    })
                    .then(() => {
                      res.status(200).json({ saveSuccess: "true" });
                    })
                    .catch((e) => console.error("Error saving a drawing:", e));
                })
                .catch((e) => console.error("Error saving the drawing: ", e));
              return;
            }
            res.status(507).json({ message: "Max amount of saves made" });
          });
      })

      .catch((e) => console.error("Error finding a user:", e));
  }
);

//User drawing DELETE request
router.delete("/profile/:drawingId", authorize, (req, res) => {
  if (req.decoded === undefined) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let drawingInfo = {};
  knex("drawings")
    .where("id", req.decoded.drawingId)
    .select()
    .then((data) => {
      if (!data[0]) {
        return res.status(404).json({ message: "No drawing with that id" });
      }
      drawingInfo.id = data[0].id;
      drawingInfo.lineart = data[0].lineart;
      drawingInfo.colours = data[0].colours;
      res.status(200).json(drawingInfo);
      fs.unlinkSync(`./public/images/colours-${data[0].id}.png`, (e) =>
        console.error(e)
      );
      fs.unlinkSync(`./public/images/thumbnail-${data[0].id}.png`, (e) =>
        console.error(e)
      );
      fs.unlinkSync(`./public/images/lineart-${data[0].id}.png`, (e) =>
        console.error(e)
      );
      return knex("drawings").del().where("id", data[0].id);
    })
    .catch((e) => console.error("Error deleting a drawing:", e));
});

//Logout GET request
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
