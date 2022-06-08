const router = require("express").Router()
const User = require("../models/User.model")

const { jwtVerify } = require("../middlewares/jwtVerify.middleware")

// get user details for the profile page

router.get("/profile/:userID", jwtVerify, (req, res) => {
  User.findById(req.params.userID)
    .then((userInfo) => {
      res.status(200).json(userInfo)
    })
    .catch((err) => {
      console.log("Error while getting user info from the DB: ", err)
    })
})

// save the changes after editing the user's information in the profile page

router.post("/profile/:userID", jwtVerify, (req, res) => {
  const { firstName, lastName, email } = req.body
  User.findByIdAndUpdate(
    req.params.userID,
    { firstName, lastName, email },
    { new: true }
  )
    .then((updatedUserInfo) => {
      res.status(201).json({ ...updatedUserInfo._doc, token: req.token }) // only pull necessary info and not entire document
    })
    .catch((err) =>
      console.log("Error while saving the updates in the user to the DB: ", err)
    )
})

module.exports = router
