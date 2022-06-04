const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User.model")

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  })
}

router.post("/register", async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(401).json({ message: "Please provide username and password." })
  }

  const userExists = await User.findOne({ username })

  if (userExists) {
    res.status(400).json({ message: "User already exists" })
  }

  const saltRounds = 10

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const user = await User.create({ username, password: hashedPassword })
    const token = generateToken(user._id)
    res.status(200).json({ username, id: user._id, token })
  } catch (error) {
    console.log(error)
  }
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(401).json({ message: "Please provide username and password." })
  }

  try {
    const user = await User.findOne({ username })

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id)
      res.status(200).json({ username, id: user._id, token })
    } else res.status(400).json({ message: "Invalid Credentials" })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
