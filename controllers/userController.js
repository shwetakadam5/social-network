const User = require("../models/User");
const Thought = require("../models/Thought");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find().populate(["thoughts", "friends"]);
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findById({ _id: req.params.userId })
        .select("-__v")
        .populate(["thoughts", "friends"]);

      if (!user) {
        return res.status(404).json({ message: "No User found with that ID" });
      }
      res.status(200).json(user);
    } catch (err) {
      if (err.name === "CastError") {
        return res.status(500).json({ "Invalid ID Value": err.value });
      }
      res.status(500).json(err);
    }
  },
  async createUser(req, res) {
    try {
      const newUserData = await User.create(req.body);
      res
        .status(200)
        .json({ Message: "User Created Successfully", newUserData });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      // Remove the thoughts created by the user
      await Thought.deleteMany({ _id: { $in: user.thoughts } });

      // Remove the user from all friend lists
      await User.updateMany(
        { friends: req.params.userId }, // Update documents where the user is a friend
        { $pull: { friends: req.params.userId } } // Remove the user from the friends array
      );

      res.json({ message: "User and associated thoughts deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
