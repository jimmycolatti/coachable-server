const router = require("express").Router()
const User = require("../models/User.model")
const Coachee = require("../models/Coachee.model")

const { jwtVerify } = require("../middlewares/jwtVerify.middleware")

// ************************************************
// GET A LIST OF COACHEES
// ************************************************

router.get("/team/:userID", jwtVerify, (req, res) => {
  User.findById(req.params.userID)
    .populate("team")
    .then((userDetails) => {
      console.log(userDetails)
      res.status(200).json(userDetails.team)
    })
    .catch((err) => {
      console.log(
        "An error occured while getting the team roster from the DB: ",
        err
      )
      res.status(500).json({ message: "Cannot connect" })
    })

  // Coachee.find()
  //   .then((allCoacheesFromDB) => {
  //     res.status(200).json(allCoacheesFromDB)
  //   })
  //   .catch((err) => {
  //     console.log(
  //       "An error occured while getting the coachees from the DB: ",
  //       err
  //     )
  //     res.status(500).json({ message: "Cannot connect" })
  //   })
})

// ************************************************
// CREATE A NEW COACHEE
// ************************************************

router.post("/team/:userID", jwtVerify, (req, res) => {
  //   console.log("This is what the user added in the form: ", req.body)

  const { firstName, lastName, email } = req.body

  Coachee.create({ firstName, lastName, email })
    .then((newCoacheeFromDB) => {
      console.log("This is the new coachee: ", newCoacheeFromDB)

      User.findByIdAndUpdate(
        req.params.userID,
        { $push: { team: newCoacheeFromDB } },
        { new: true }
      ).then((updatedUserInfo) => {
        res.status(200).json(newCoacheeFromDB)
      })
    })
    .catch((err) =>
      console.log("Error while saving a new coachee in the DB: ", err)
    )
})

module.exports = router
