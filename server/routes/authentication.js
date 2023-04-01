const router = require("express").Router();
const {
  registerHandler,
  loginHandler,
  logOutUser,
} = require("../middlewares/authentication");

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/logout", logOutUser);

module.exports = router;
