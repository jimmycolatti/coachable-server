const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User.model")

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  })
}

// create an account

router.post("/register", async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body

  if (!email || !password) {
    res.status(401).json({ message: "Please provide email and password." })
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400).json({ message: "User already exists" })
  }

  const saltRounds = 10

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const user = await User.create({ email, password: hashedPassword })
    const token = generateToken(user._id)
    res.status(200).json({ email, _id: user._id, token })
  } catch (error) {
    console.log(error)
  }
})

// login with an existing account

router.post("/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    // console.log("Please provide email and password.") // working
    res.status(401).json({ message: "Please provide email and password." })
  }

  try {
    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id)
      res.status(200).json({
        email,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        token,
      })
    } else res.status(400).json({ message: "Invalid Credentials" })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
