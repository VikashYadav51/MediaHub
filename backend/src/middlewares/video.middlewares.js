import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

import { Channel } from "../models/channel.models.js";


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

  if (channel.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You are not the owner of this video");
  }

  next();
});


export {
  verifyVideoOwner,
}

