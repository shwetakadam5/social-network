const router = require("express").Router();
const {
  getSingleUser,
  getUsers,
  createUser,
  deleteUser,
} = require("../../controllers/userController");

router.route("/").get(getUsers).post(createUser);

router.route("/:userId").get(getSingleUser).delete(deleteUser);

module.exports = router;
