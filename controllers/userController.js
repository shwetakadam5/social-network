const User = require("../models/User");
const Thought = require("../models/Thought");

module.exports = {
  // Function to get all the users.
  async getUsers(req, res) {
    try {
      const users = await User.find().populate(["thoughts", "friends"]);
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Function to get a single user based on the user id
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
  //  Function to create a new user. The request body would look like
  // {
  //   "username" : "Shweta Kadam2",
  //   "email" : "Shweta.kadam2@gmail.com"
  // }
  async createUser(req, res) {
    try {
      const newUserData = await User.create(req.body);
      res
        .status(200)
        .json({ message: "User Created Successfully", newUserData });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //  Function to delete a user based on the user id.
  // All the thoughts associated with the user are also deleted and the friends list of the other users are also updated.
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      // Remove the thoughts created by the user
      await Thought.deleteMany({ _id: { $in: user.thoughts } });

      // Remove the user from all friend lists
      const resultUpdated = await User.updateMany(
        { friends: req.params.userId }, // Update documents where the user is a friend
        { $pull: { friends: req.params.userId } } // Remove the user from the friends array
      );

      res.json({
        message:
          "User and associated thoughts & associated user in friends deleted!",
      });
    } catch (err) {
      if (err.name === "CastError") {
        return res.status(500).json({ "Invalid ID Value": err.value });
      }
      res.status(500).json(err);
    }
  },
  // Function to update the user based on user id.The $set operator in mongodb is used to inject the request body. Enforces validation.
  async updateUser(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "No User with this id!" });
      }

      res.status(200).json(updatedUser);
    } catch (err) {
      if (err.name === "CastError") {
        return res.status(500).json({ "Invalid ID Value": err.value });
      }
      res.status(500).json(err);
    }
  },
  //Function to get the friends of a user id.
  async getFriends(req, res) {
    try {
      const userFriends = await User.findById({
        _id: req.params.userId,
      })
        .select("friends")
        .populate("friends");

      if (!userFriends) {
        return res.status(404).json({ message: "No friends found for the ID" });
      }
      res.status(200).json(userFriends);
    } catch (err) {
      if (err.name === "CastError") {
        return res.status(500).json({ "Invalid ID Value": err.value });
      }
      res.status(500).json(err);
    }
  },
  //  Function to add a new friend to the user id. The friend is identified with a friendId
  async createFriend(req, res) {
    try {
      const friendDetails = await User.findById({
        _id: req.params.friendId,
      });

      // Add the friend to the user
      const userUpdated = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: friendDetails } }, // Add the friend to the friends
        { runValidators: true, new: true }
      );

      res.status(200).json({
        message: "Friend added in the associated user list successfully",
        friendDetails,
        userUpdated,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //  Function to delete a friend from the user id's list . The friend is identified with a friendId
  async deleteFriend(req, res) {
    try {
      const friendDeletedFromUser = await User.findByIdAndUpdate(
        { _id: req.params.userId },
        { $pullAll: { friends: [{ _id: req.params.friendId }] } }, // Delete the friend from the friends
        { runValidators: true, new: true }
      );

      res.status(200).json({
        message: "Friend deleted from the associated user successfully",
        friendDeletedFromUser,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
