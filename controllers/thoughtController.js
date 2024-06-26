const User = require("../models/User");
const Thought = require("../models/Thought");

module.exports = {
  // Function to get all the thoughts.
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().populate(["username", "reactions"]);
      res.status(200).json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Function to get a single thought based on the thought id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findById({ _id: req.params.thoughtId })
        .select("-__v")
        .populate(["username", "reactions"]);

      if (!thought) {
        return res
          .status(404)
          .json({ message: "No Thought found with that ID" });
      }
      res.status(200).json(thought);
    } catch (err) {
      if (err.name === "CastError") {
        return res.status(500).json({ "Invalid ID Value": err.value });
      }
      res.status(500).json(err);
    }
  },
  //  Function to create a new thought. The request body would look like
  // {
  //   "thoughtText" : "Try try till you succeedaa",
  //   "username" : "667c1f889dce66deb588e69f",
  //   "reactions" : [{"reactionBody" : "True" , "username" : "667c1f889dce66deb588e6a0"}]
  // }
  async createThought(req, res) {
    try {
      const newThoughtData = await Thought.create(req.body);

      // Add the thought in the User thoughts
      const userUpdated = await User.findOneAndUpdate(
        { _id: newThoughtData.username },
        { $push: { thoughts: newThoughtData } }, // Add the thought to the thoughts array of the user
        { runValidators: true, new: true }
      );

      res.status(200).json({
        message:
          "Thought created and added in the associated user thoughts successfully",
        newThoughtData,
        userUpdated,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //  Function to delete a thought based on the thought id. The thought is also removed from the thoughts list of the user.
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      // Remove the thought from thoughts list
      const resultUpdated = await User.findOneAndUpdate(
        { _id: thought.username },
        { $pull: { thoughts: req.params.thoughtId } }, // Remove the thought from the thoughts array
        { runValidators: true, new: true }
      );

      res.json({
        message:
          "Thought removed and associated thoughts in the user deleted successfully",
        thought,
        resultUpdated,
      });
    } catch (err) {
      if (err.name === "CastError") {
        return res.status(500).json({ "Invalid ID Value": err.value });
      }
      res.status(500).json(err);
    }
  },
  //  Function to update a thought based on the thought id.
  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: "No Thought with this id!" });
      }

      res.status(200).json(updatedThought);
    } catch (err) {
      if (err.name === "CastError") {
        return res.status(500).json({ "Invalid ID Value": err.value });
      }
      res.status(500).json(err);
    }
  },
  //Function to get the reactions on a thought identified by thought id.
  async getReactions(req, res) {
    try {
      const reactionsOnThought = await Thought.findById({
        _id: req.params.thoughtId,
      }).select("reactions");

      if (!reactionsOnThought) {
        return res
          .status(404)
          .json({ message: "No Reactions found for the ID" });
      }
      res.status(200).json(reactionsOnThought);
    } catch (err) {
      if (err.name === "CastError") {
        return res.status(500).json({ "Invalid ID Value": err.value });
      }
      res.status(500).json(err);
    }
  },
  //  Function to create a new reaction on a thought identified by thought id. The request body would look like
  //   {
  //     "reactionBody": "Perfect",
  //      "username": "667cec5994094c7b3aeea889"

  // }
  async createReaction(req, res) {
    try {
      const newReactionData = { ...req.body };

      // Add the reaction in the thoughts
      const thoughtUpdated = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: newReactionData } }, // Add the reaction to the reactions
        { runValidators: true, new: true }
      );

      res.status(200).json({
        message:
          "Reaction created and added in the associated thought successfully",
        newReactionData,
        thoughtUpdated,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Function to delete the reactions on a thought identified by thought id.
  async deleteReaction(req, res) {
    try {
      // Delete the reaction in the thoughts
      const reactionDeletedFromThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } }, // Delete the reaction from the reactions
        { runValidators: true, new: true }
      );

      res.status(200).json({
        message: "Reaction deleted from the associated thought successfully",
        reactionDeletedFromThought,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
