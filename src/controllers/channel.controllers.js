import { asyncHandler } from '../utils/asyncHandler.js';

import { ApiResponse } from '../utils/ApiResponse.js';

import { ApiError } from '../utils/ApiError.js';

import { Channel } from '../models/channel.models.js';

const changeChannelName = asyncHandler( async(req, res) =>{
    const { oldChannelName, newChannelName } = req.body;

    if(!oldChannelName || newChannelName.trim() === ""){
        throw new ApiError(400, "Channel name is required", { newChannelName });
    }

    const channel = await Channel.findById(req.channel?._id);
    
    if(!channel){
        throw new ApiError(404, "Channel not found", { channelId : req.channel?._id });
    }
    
    channel.name = newChannelName;

    await channel.save({ validateBeforeSave : false });

    if(channel.name !== newChannelName){
        throw new ApiError(400, "Channel name not changed", { newChannelName });
    }

    return res.status(200).json(new ApiResponse(200, "Channel name changed successfully", channel));
});


const changeDescription = asyncHandler( async(req, res) =>{
    const { description } = req.body;

    const channel = await Channel.findById(req.channel._id);

    if(!channel){
        throw new ApiError(404, "Channel not found", { channelId : req.channel._id });
    }

    channel.description = description;

    await channel.save({ validateBeforeSave : false });

    return res.status(200).json(new ApiResponse(200, "Channel description changed successfully", channel));
});


const findSubscribers = asyncHandler( async(req, res) =>{
    const channel = await Channel.findById(req.channel?._id);

    if(!channel){
        throw new ApiError(404, "Channel not found", { channelId : req.channel?._id });
    }

    return res.status(200).json(new ApiResponse(200, "Subscribers found successfully", channel.subscribers));
});


export {
    changeChannelName,
    changeDescription,
    findSubscribers,

}
