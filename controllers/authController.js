const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const user = req.body;
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1d',
  });
  res.send({ accessToken });
};
