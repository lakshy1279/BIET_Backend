const express = require("express");

const router = express.Router();
router.use("/post", require("./post"));
router.use("/user", require("./user"));
router.use("/friend", require("./friend"));
module.exports = router;
