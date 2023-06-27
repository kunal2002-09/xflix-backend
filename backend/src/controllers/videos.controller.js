const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { videosService } = require("../services");

const getVideos = catchAsync(async (req, res) => {
  const { title, genres, contentRating, sortBy } = req.query;
  const filters = {};

  if (title) {
    filters.title = { $regex: title, $options: 'i' };
  }

  if (genres) {
    const genreArray = genres.split(',').map((genre) => genre.trim());
    filters.genre = { $in: genreArray };
  }

  if (contentRating) {
    filters.contentRating = {$regex:contentRating};
  }

  const filteredVideos = await videosService.getAllVideos(filters, sortBy);
  res.status(httpStatus.OK).send({ videos: filteredVideos });
});



const getVideoById = catchAsync(async (req, res) => {
  const { videoId } = req.params;
  const video = await videosService.getVideoById(videoId);

  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
  }

  res.status(httpStatus.OK).send(video);
});

const postVideo = catchAsync(async (req, res) => {
  const video = await videosService.postVideo(req.body);
  res.status(httpStatus.CREATED).send(video);
});

const votes = catchAsync(async (req, res) => {
  const { videoId } = req.params;

  await videosService.updateVotes(videoId, req.body);

  res.status(httpStatus.NO_CONTENT).send();
});

const views = catchAsync(async (req, res) => {
  const { videoId } = req.params;
  await videosService.incrementViews(videoId);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getVideos,
  getVideoById,
  postVideo,
  votes,
  views,
};
