const express = require("express");
const fs = require("fs");
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

//Authentication middleware
/* const checkAuth = (req, _, next) => {
  console.log(req.sessionStore.sessions)
  if (req.sessions.passport.user !== undefined) {
    next();
    return {
      user: req.sessions.passport.user,
      drawingId: req.drawingId || "none",
    };
  }
}; */

//Google authentication GET requests
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_URL,
  }),
  (_, res) => {
    res.redirect(301, `${process.env.REACT_APP_URL}/profile`);
  }
);

//User profile GET request
router.get("/profile", (req, res) => {
  if (req.user === undefined) {
    return res.status(401).json({message: "Unauthorized"});
  }
  let profileInfo = {};
  knex("users")
    .where("g_id", userId)
    .first()
    .then((data) => {
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
          res.status(200).send(profileInfo);
        });
    })
    .catch((e) => console.error("Error finding a profile:", e));
});

//User drawing GET request
router.get("/profile/:drawingId", (req, res) => {
  let drawingInfo = {};
  knex("drawings")
    .where("id", req.drawingId)
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
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "colours", maxCount: 1 },
    { name: "lineart", maxCount: 1 },
  ]),
  (req, res) => {
    let userId = "";
    knex("users")
      .where("g_id", req.user)
      .first()
      .then((data) => {
        userId = data.g_id;
        knex("drawings")
          .where("user_id", userId)
          .then((result) => {
            if (result.length <= 11) {
              knex("drawings")
                .where("id", req.drawingId)
                .then((result) => {
                  if (!result[0]) {
                    knex("drawings")
                      .insert({
                        user_id: userId,
                        id: req.drawingId,
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
                    .where("id", req.drawingId)
                    .update({
                      user_id: userId,
                      id: req.drawingId,
                      thumbnail: `${process.env.CLIENT_URL}/images/${req.files.thumbnail[0].filename}`,
                      colours: `${process.env.CLIENT_URL}/images/${req.files.colours[0].filename}`,
                      lineart: `${process.env.CLIENT_URL}/images/${req.files.lineart[0].filename}`,
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
router.delete("/profile/:drawingId", (req, res) => {
  let drawingInfo = {};
  knex("drawings")
    .where("id", req.drawingId)
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
router.get("/logout", (_, res) => {
  res.logout();
  res.sessionStore.close();
  res.redirect(process.env.REACT_APP_URL);
  res.status(200).json({ message: "Logout successful" });
});

//Sample images GET request
router.get("/samples", (_, res) => {
  let sampleArr = [];
  for (let i = 1; i <= process.env.SAMPLES; i++) {
    sampleArr.push({
      path: `${process.env.CLIENT_URL}/gallerai-samples/sample-${i}.png`,
    });
  }
  res.status(200).json(sampleArr);
});

module.exports = router;
