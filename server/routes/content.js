const router = require("express").Router();
const { getContentHandler } = require("../middlewares/content");
const { authenticationHandler } = require("../middlewares/authentication");

router.get("/dashboard", authenticationHandler, getContentHandler);

module.exports = router;
