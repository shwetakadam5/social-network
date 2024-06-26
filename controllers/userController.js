const User = require("../models/User");

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
};
