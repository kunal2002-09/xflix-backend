const express = require("express");

const { videosController } = require("../../controllers");

const router = express.Router();

router.get("/", videosController.getVideos);
router.post("/", videosController.postVideo);
router.get(
  "/:videoId",
  videosController.getVideoById
);
router.patch("/:videoId/votes", videosController.votes)
router.patch("/:videoId/views", videosController.views)


module.exports = router;
