const jwt = require("jsonwebtoken");

exports.generateToken = async (data) => {
  return jwt.sign(data, global.SALT_KEY, { expiresIn: "1d" });
};

exports.decodeToken = async (token) => {
  const data = jwt.verify(token, global.SALT_KEY);

  return data;
};

exports.authorize = (req, res, next) => {
  var token = req.headers["bearer"];

  if (!token) {
    res.status(401).json({
      message: "Acesso restrito",
    });
  } else {
    jwt.verify(token, global.SALT_KEY, function (error, decoded) {
      if (error) {
        res.status(401).json({
          message: "Token Inváldo",
        });
      } else {
        next();
      }
    });
  }
};
