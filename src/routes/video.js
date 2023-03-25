const { createVideo, getVideo, deleteVideo, updateVideo } = require("../controllers/video");

const router = require("express").Router();

router.route("/").get(getVideo).post(createVideo);
router.route("/:id").put(updateVideo).delete(deleteVideo);

module.exports = router;
