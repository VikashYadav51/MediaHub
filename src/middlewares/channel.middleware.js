import ApiError from '../utils/ApiError.js';

import { Channel } from '../models/channel.model.js';

import asyncHandler from '../utils/asyncHandler.js';

const verifyChannelOwner = asyncHandler( async(req, res, next) =>{
    const channel = await Channel.findById(req.user?._id);

    if(!channel){
        throw new ApiError(404, "Channel not found", { channelId : req.user?._id });
    }

    if(channel.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not the owner of this channel");
    }

    req.channel = channel;
    
    next();
});

export default verifyChannelOwner;

