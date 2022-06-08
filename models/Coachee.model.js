const { Schema, model } = require("mongoose")

const coacheeSchema = new Schema(
  {
    // profilePicture:
    firstName: String,
    lastName: String,
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
    supervisor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
)

const Coachee = model("Coachee", coacheeSchema)

module.exports = Coachee
