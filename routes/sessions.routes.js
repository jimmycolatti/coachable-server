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
    .populate({ path: "sessions", options: { sort: "date" } }) //ascending order, to make it descend add a - in front of 'date
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
  //   console.log("This is what the user added in the form: ", req.body)
  const { date, coachee, description, notes, completed } = req.body
  Session.create({ date, coachee, description, notes, completed })
    .then((newSessionFromDB) => {
      console.log("This is the new session: ", newSessionFromDB)
      User.findByIdAndUpdate(
        req.params.userID,
        { $push: { sessions: newSessionFromDB } },
        { new: true }
      ).then((updatedUserInfo) => {
        res.status(200).json(newSessionFromDB)
      })
    })
    .catch((err) =>
      console.log("Error while saving a new session in the DB: ", err)
    )
})

// ************************************************
// GET SESSION DETAILS ROUTE
// ************************************************

router.get("/sessions/:userID/meeting/:sessionID", jwtVerify, (req, res) => {
  console.log("its working")
  Session.findById(req.params.sessionID)
    .populate("coachee")
    .then((sessionFromDB) => {
      res.status(200).json(sessionFromDB)
    })
    .catch((err) =>
      console.log("Error while getting session details from the DB: ", err)
    )
})

// ************************************************
// POST ROUTE: SAVE CHANGES/EDITS MADE TO SESSION
// ************************************************

router.post("/sessions/:userID/meeting/:sessionID", jwtVerify, (req, res) => {
  const { description, notes, completed } = req.body

  Session.findByIdAndUpdate(
    req.params.sessionID,
    { description, notes, completed },
    { new: true }
  )
    .then((updatedSessionFromDB) => {
      res.status(201).json(updatedSessionFromDB)
    })
    .catch((err) => {
      console.log(
        "Error while saving the updates in the session to the DB: ",
        err
      )
    })
})

// ************************************************
// DELETE SESSION FROM DATABASE
// ************************************************

router.delete("/sessions/:userID/meeting/:sessionID", jwtVerify, (req, res) => {
  Session.findByIdAndDelete(req.params.sessionID)
    .then(() => {
      User.findByIdAndUpdate(req.params.userID, {
        $pullAll: { sessions: [req.params.sessionID] },
      }).then((updatedUserInfo) => {
        res.status(200).json(updatedUserInfo)
      })
    })

    .catch((err) =>
      console.log("Error while deleting a coachee from the DB: ", err)
    )
})

module.exports = router
