import ApiError from "../utils/ApiError.js";

import asyncHandler from "../utils/asyncHandler.js";

import { Video } from "../models/video.models.js";

import { Channel } from "../models/channel.models.js";


const loadVideoByUrl = asyncHandler(async (req, res, next) => {
  const videoUrl = req.body?.videoUrl || req.params?.videoUrl;

  if (!videoUrl) {
    throw new ApiError(400, "videoUrl is required");
  }

  const video = await Video.findOne({ videoUrl });

  if (!video) {
    throw new ApiError(404, "Video not found", { videoUrl });
  }


  req.video = video;

  next();

});


const verifyVideoOwner = asyncHandler(async (req, res, next) => {
  const video = req.video;

  if (!video) {
    throw new ApiError(500, "Video must be loaded before ownership check");
  }

  const channel = await Channel.findById(video.channel);

  if (!channel) {
    throw new ApiError(404, "Channel not found for video", { channelId: video.channel });
  }

  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }

  if (channel.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not the owner of this video");
  }

  next();
});


export {
  loadVideoByUrl,
  verifyVideoOwner,
}

