const { Schema, model } = require("mongoose")

const sessionSchema = new Schema(
  {
    date: Date,
    coachee: [
      {
        type: Schema.Types.ObjectId,
        ref: "Coachee",
      },
    ],
    description: String,
    notes: String,
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
)

const Session = model("Session", sessionSchema)

module.exports = Session
