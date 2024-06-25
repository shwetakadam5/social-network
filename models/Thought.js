const { Schema, model, now } = require("mongoose");
const dayjs = require("dayjs");
const Reaction = require("./Reaction");

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: [true, "Thought text is required."],
      minlength: 1,
      maxlength: 280,
    },

    createdAt: {
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

    reactions: [Reaction],
  },
  { toJSON: { getters: true, virtuals: true } }
);

// Created a virtual property `reactionCount` that retrieves the length of the thought's `reactions` array field on query.
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// Initialize our User model
const Thought = model("thought", thoughtSchema);

module.exports = Thought;
