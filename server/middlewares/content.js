const { StatusCodes } = require("http-status-codes");

const getContentHandler = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    success: true,
    msg: `/public/pages/content/dashboard.html`,
  });
};

module.exports = { getContentHandler };
