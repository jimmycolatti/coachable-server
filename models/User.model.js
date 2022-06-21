const { Schema, model } = require("mongoose")

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    imgURL: String,
    firstName: String,
    lastName: String,
    googleId: String,
    email: {
      type: String,
      minlength: 5,
      maxlength: 1000,
      unique: true,
      trim: true,
      required: [true, "email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"], //it can be here or in auth.routes
      lowercase: true,
    },
    // password: {
    //   type: String,
    //   required: [true, "password is required"],
    //   minlength: 5,
    //   maxlength: 1000,
    // },
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: "Coachee",
      },
    ],
    sessions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Session",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
)

const User = model("User", userSchema)

module.exports = User
