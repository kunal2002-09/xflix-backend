const { Video } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const getAllVideos = async (filters, sortBy) => {
  try {
    let sortOptions = {};
    if (sortBy === "viewCount" || sortBy === "releaseDate") {
      sortOptions[sortBy] = -1; // -1 for descending order
    }
    console.log(filters)
    const videos = await Video.find(filters).sort(sortOptions);
    return videos;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching videos from the database");
  }
};


const getVideoById = async (videoId) => {
  try {
    const video = await Video.findOne({ _id: videoId });
    return video;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching video from the database");
  }
};

const postVideo = async (data) => {
  try {
    const video = await Video.create(data);
    return video;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error creating video");
  }
};

const updateVotes = async (videoId, data) => {
  try {
    const { vote, change } = data;
    console.log(videoId,data)
    const video = await Video.findOne({ _id: videoId });
    let upVotes = parseInt(video.votes.upVotes);
    let downVotes = parseInt(video.votes.downVotes);
    
    if (vote === "upVote") {
      if(change==="increase"){
        upVotes += 1;
      }
      else{
        upVotes-=1
      }
    } else {
        if(change==="decrease"){
          downVotes -= 1;
        }
        else{
          downVotes+=1
        }
    }
    video.votes.upVotes = upVotes.toString();
    video.votes.downVotes = downVotes.toString();
    await video.save();
    console.log(video)
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error updating votes for video");
  }
};


const incrementViews = async (videoId) => {
  try {
    const video = await Video.findOne({ _id: videoId });

    let viewsCount = parseInt(video.viewCount);
    viewsCount += 1;

    video.viewCount = viewsCount.toString();
console.log(video)
    await video.save();
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error updating views for video");
  }
};


module.exports = {
  getAllVideos,
  getVideoById,
  postVideo,
  updateVotes,
  incrementViews
};
