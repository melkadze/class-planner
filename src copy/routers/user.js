const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload")
const router = new express.Router();

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateToken(); //lowercase so that token is generated for ONLY this user
    res.send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();

    res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
router.post("/users/logout", auth, async (req, res) => {
  //console.log(token.token);
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      console.log(token.token);
      return token.token !== req.token;

      //We ONLY return the tokens that do not match the bearer token
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get("/users", async (req, res) => {
  try {
    let users = await User.find({});
    res.send(users);
    console.log(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.patch("/users/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    let user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/users/me/profilePic",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      res.send("Upload successful")
    } catch(error) {
      res.send(error)
    }
  }
)

module.exports = router;