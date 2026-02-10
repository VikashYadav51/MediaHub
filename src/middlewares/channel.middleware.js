import ApiError from '../utils/ApiError.js';

import { Channel } from '../models/channel.models.js';

import  asyncHandler  from '../utils/asyncHandler.js';

const verifyChannelOwner = asyncHandler( async(req, res, next) =>{
    const { channelId } = req.params;
    console.log("params:", req.params);
    console.log("userId:", req.user?._id);
    console.log("channelId:", channelId);

    const channel = await Channel.findById(channelId);
    
    if(!channel){
        throw new ApiError(404, "Channel not found", { channelId: channelId || req.user?._id });
    }

    if(channel.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not the owner of this channel");
    }

    req.channel = channel;

    next();
});

export default verifyChannelOwner;

