const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  console.log(req.body);
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    req.user = decoded.UserInfo.username;
    //req.user = "Dave";
    req.roles = decoded.UserInfo.roles;
    //req.roles = 2001;
    next();
  });
};

module.exports = verifyJWT;
