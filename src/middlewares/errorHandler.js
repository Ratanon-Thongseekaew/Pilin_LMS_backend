const errorhandler = (err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "something went wrong !" });
};

module.exports = errorhandler;
