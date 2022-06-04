const jwt = require("jsonwebtoken")
const User = require("../models/User.model")

//This middleware will verify the JWT token and give user the access permisson to use the server
//Add this middleware whenever you need to protect backend route from unauthorized user.

const jwtVerify = async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // console.log(req.headers.authorization)
    token = req.headers.authorization.split(" ")[1]

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if (decodedToken) req.user = await User.findById(decodedToken.id)
    else res.status(404).json({ message: "You are not allowed to access this" })
    req.token = token
    next()
  }
  if (!token)
    res.status(404).json({ message: "You are not allowed to access this" })
}

module.exports = { jwtVerify }
