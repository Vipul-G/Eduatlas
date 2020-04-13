const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // if not contain tocken then it might fail
  try {
    const token =  req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.body._id = decodedToken._id;
    next();
  } catch(error) {
    res.status(401).json({ message: 'Tocken is not valid or not provided' });
    return;
  }
};
