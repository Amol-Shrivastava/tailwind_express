const Users = require("../model/user");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const consola = require("consola");
const path = require("path");

const registerHandler = async (req, res) => {
  try {
    const newUser = new Users(req.body);
    await newUser.save();
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, msg: `Successfully created the user` });
  } catch (error) {
    if (error.code == 11000) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: `User with this email already exists` });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const loginHandler = async (req, res) => {
  if (!req.session.userId) {
    const { email, password } = req.body;

    try {
      const user = await Users.findOne({ email });
      if (!user)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ success: false, msg: "User not found" });

      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched)
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ success: false, msg: "Wrong Password" });

      req.session.email = email;
      req.session.username = user.username;
      req.session.userId = user._id;

      return res.status(StatusCodes.ACCEPTED).json({
        success: true,
        msg: "You have successfully logged in",
        data: { email, username: user.username },
      });

      // return res.redirect("/content/dashboard");
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, msg: error.message });
    }
  } else {
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      msg: `You are already logged in the application`,
    });
  }
};

const authenticationHandler = async (req, res, next) => {
  if (!req.session.userId)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      msg: `${req.session.username} is not authorized to access this page`,
    });

  next();
};

const logOutUser = async (req, res) => {
  try {
    if (req.session.userId) {
      req.session.email = null;
      req.session.username = null;
      req.session.userId = null;

      req.session.save(function (err) {
        if (err) throw err;
      });

      req.session.regenerate((err) => {
        throw err;
      });

      res.redirect("/");
    }
  } catch (error) {
    consola.error(error);
  }

  // return res
  //   .status(StatusCodes.OK)
  //   .json({ success: true, msg: `You have successfully been logged out` });
};

module.exports = {
  registerHandler,
  loginHandler,
  authenticationHandler,
  logOutUser,
};
