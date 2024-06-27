const router = require("express").Router();
const {
  getSingleThought,
  getThoughts,
  createThought,
  deleteThought,
  updateThought,
  getReactions,
  createReaction,
} = require("../../controllers/thoughtController");

router.route("/").get(getThoughts).post(createThought);

router
  .route("/:thoughtId")
  .get(getSingleThought)
  .delete(deleteThought)
  .put(updateThought);

router.route("/:thoughtId/reactions/").get(getReactions).post(createReaction);

module.exports = router;
