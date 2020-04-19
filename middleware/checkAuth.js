const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // if not contain tocken then it might fail
  try {
    const token =  req.headers.authorization.split(" ")[1];
    console.log(process.env.JWT_KEY);
    const decodedToken = jwt.verify(token, process.env.JWT_KEY, {ignoreExpiration : true});
    req.user = {};
    req.user._id = decodedToken._id;
    req.user.phone = decodedToken.phone;
    next();
  } catch(error) {
    console.log(error);
    res.status(401).json({ message: 'Tocken is not valid or not provided' });
    return;
  }
};
 