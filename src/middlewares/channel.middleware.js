import ApiError from '../utils/ApiError.js';

import { Channel } from '../models/channel.models.js';

import  asyncHandler  from '../utils/asyncHandler.js';

const verifyChannelOwner = asyncHandler( async(req, res, next) =>{
    
    const channelId = req.params.channelId;

    const channel = await Channel.findById(channelId).select('owner');

    if(!channel){
        throw new ApiError(404, "Channel not found", { channelId });
    }

    if(channel.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not the owner of this channel");
    }

    channel.channel = channel;
    next();


});

export default verifyChannelOwner;

