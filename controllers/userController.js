const User = require("../models/User");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async createUser(req, res) {
    try {
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
