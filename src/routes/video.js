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

router
  .route("/")
  .get(authJWT, sessionChecker, getVideo)
  .post(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: true, validated: true }),
    createVideo
  );

router
  .route("/:id")
  .put(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: true, validated: true }),
    updateVideo
  )
  .delete(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: true, validated: true }),
    deleteVideo
  );

router
  .route("/:id/like")
  .put(
    authJWT,
    (req, res, next) =>
      sessionChecker(req, res, next, { admin: false, validated: true }),
    likeVideo
  );

module.exports = router;
