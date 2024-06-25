const { Schema, model, now, Types } = require("mongoose");

const dayjs = require("dayjs");
const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  reactionBody: [
    {
      type: String,
      required: [true, "Reaction details is required."],
      maxlength: 280,
    },
  ],
  username: [
    {
      type: String,
      required: [true, "Reaction username is required."],
    },
  ],
  createdAt: [
    {
      type: Date,
      default: Date.now,
      get: (date) => {
        if (date != null) {
          const originalDate = dayjs(date);
          const newDate = originalDate.format("M/D/YYYY");
          return newDate;
        }
        return;
      },
    },
  ],
});
module.exports = reactionSchema;
