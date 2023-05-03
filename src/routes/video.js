const {
  createVideo,
  getVideo,
  deleteVideo,
  updateVideo,
  likeVideo,
} = require("../controllers/video");
const { authJWT } = require("../middlewares/auth");
const { sessionChecker } = require("../middlewares/session-checker");

const router = require("express").Router();

router.route("/").get(getVideo).post(createVideo);
router
  .route("/:id")
  .put(authJWT, sessionChecker, updateVideo)
  .delete(authJWT, sessionChecker, deleteVideo);

router.route("/:id/like").put(authJWT, sessionChecker, likeVideo);

module.exports = router;
