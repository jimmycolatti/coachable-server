const { Schema, model } = require("mongoose")

const coacheeSchema = new Schema(
  {
    // img: {
    //   data: Buffer,
    //   conentType: String,
    // },
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
    disciplinary: {
      pep: {
        type: Boolean,
        default: false,
      },
      cap: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
)

const Coachee = model("Coachee", coacheeSchema)

module.exports = Coachee
