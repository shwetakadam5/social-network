const router = require("express").Router();
const {
  getSingleUser,
  getUsers,
  createUser,
} = require("../../controllers/userController");

router.route("/").get(getUsers).post(createUser);

router.route("/:userId").get(getSingleUser);

module.exports = router;
