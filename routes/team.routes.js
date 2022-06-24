const router = require("express").Router()
const User = require("../models/User.model")
const Coachee = require("../models/Coachee.model")

const { jwtVerify } = require("../middlewares/jwtVerify.middleware")

// ************************************************
// GET A LIST OF COACHEES
// ************************************************

router.get("/team/:userID", jwtVerify, (req, res) => {
  User.findById(req.params.userID)
    .populate({ path: "team", options: { sort: "firstName" } })
    .then((userDetails) => {
      // console.log(userDetails)
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

// ************************************************
// GET COACHEE DETAILS ROUTE
// ************************************************

router.get("/team/:userID/coachee/:coacheeID", jwtVerify, (req, res) => {
  Coachee.findById(req.params.coacheeID)
    .then((coacheeFromDB) => {
      res.status(200).json(coacheeFromDB)
    })
    .catch((err) =>
      console.log("Error while getting a coachee details from the DB: ", err)
    )
})

// ************************************************
// POST ROUTE: SAVE CHANGES/EDITS MADE TO COACHEE
// ************************************************

router.post("/team/:userID/coachee/:coacheeID", jwtVerify, (req, res) => {
  const { firstName, lastName, email } = req.body

  Coachee.findByIdAndUpdate(
    req.params.coacheeID,
    { firstName, lastName, email },
    { new: true }
  )
    .then((updatedCoacheeFromDB) => {
      res.status(201).json(updatedCoacheeFromDB)
    })
    .catch((err) => {
      console.log(
        "Error while saving the updates in the coachee to the DB: ",
        err
      )
    })
})

// ************************************************
// DELETE COACHEE FROM DATABASE
// ************************************************

router.delete("/team/:userID/coachee/:coacheeID", jwtVerify, (req, res) => {
  Coachee.findByIdAndDelete(req.params.coacheeID)
    .then(() => {
      User.findByIdAndUpdate(req.params.userID, {
        $pullAll: { team: [req.params.coacheeID] },
      }).then((updatedUserInfo) => {
        res.status(200).json(updatedUserInfo)
      })
    })

    .catch((err) =>
      console.log("Error while deleting a coachee from the DB: ", err)
    )
})

module.exports = router
