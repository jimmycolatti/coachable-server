const router = require("express").Router()
const User = require("../models/User.model")
const Coachee = require("../models/Coachee.model")
const Session = require("../models/Session.model")

const { jwtVerify } = require("../middlewares/jwtVerify.middleware")

// ************************************************
// GET A LIST OF SESSIONS
// ************************************************

router.get("/sessions/:userID", jwtVerify, (req, res) => {
  User.findById(req.params.userID)
    .populate("sessions")
    .populate("team")
    .then((userDetails) => {
      //   console.log(userDetails)
      res.status(200).json(userDetails)
    })
    .catch((err) => {
      console.log("An error occured while getting details from the DB: ", err)
      res.status(500).json({ message: "Cannot connect" })
    })
})

// ************************************************
// CREATE A NEW SESSION
// ************************************************

router.post("/sessions/:userID", jwtVerify, (req, res) => {
  console.log("This is what the user added in the form: ", req.body)

  //   const { date, coachee, notes, completed } = req.body

  //   Coachee.create({ firstName, lastName, email })
  //     .then((newCoacheeFromDB) => {
  //       console.log("This is the new coachee: ", newCoacheeFromDB)

  //       User.findByIdAndUpdate(
  //         req.params.userID,
  //         { $push: { team: newCoacheeFromDB } },
  //         { new: true }
  //       ).then((updatedUserInfo) => {
  //         res.status(200).json(newCoacheeFromDB)
  //       })
  //     })
  //     .catch((err) =>
  //       console.log("Error while saving a new coachee in the DB: ", err)
  //     )
})

module.exports = router
