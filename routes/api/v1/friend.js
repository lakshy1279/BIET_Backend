const express = require("express");
const passport = require("passport");
const router = express.Router();
const friendApi = require("../../../controllers/api/v1/friend");
router.post(
  "/create_friendship",
  passport.authenticate("jwt", { session: false }),
  friendApi.addfriend
);
router.get(
  "/fetch_user_friends",
  passport.authenticate("jwt", { session: false }),
  friendApi.friend
);
router.post(
  "/remove_friendship",
  passport.authenticate("jwt", { session: false }),
  friendApi.destroy
);
module.exports = router;
