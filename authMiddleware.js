// authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyTokenUser = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
};

const verifyTokenAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const authHeaderPerm = req.headers['permission'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) {
      return res.sendStatus(403);
    }

    if(user.permission != "Admin" && user.permission != "Super Admin"){
      console.log(user.permission);
      return res.json({ status: 400, message: 'You do not have permission'});
    }
    // if (!user.isAdmin) {
    //   return res.sendStatus(403); 
    // }

    req.user = user;
    next();
  });
};


module.exports = {
  verifyTokenUser,
  verifyTokenAdmin,
};
