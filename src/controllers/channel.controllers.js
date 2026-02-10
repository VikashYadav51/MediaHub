import  asyncHandler  from '../utils/asyncHandler.js';

import  ApiResponse  from '../utils/ApiResponse.js';

import ApiError  from '../utils/ApiError.js';

import { Channel } from '../models/channel.models.js';


const createChannel = asyncHandler( async(req, res) =>{
    const { name, description } = req.body;

    const checkChannel = await Channel.findOne({
        $or : [
            { name }, { description}
        ]
    })

    if(checkChannel){
        throw new ApiError(400, "Channel name or description already exists", { name, description });
    }

    const channel = await Channel.create({
        name,
        description,
        owner : req.user?._id,
        videos : [],
        subscribers : [],
    });

    return res.status(201)
    .json(
        new ApiResponse(201, "Channel created successfully", channel),
    )

})

const changeChannelName = asyncHandler( async(req, res) =>{
    const { oldChannelName, newChannelName } = req.body;

    if (newChannelName === "") {
    throw new ApiError(400, "New channel name is required");
}

    const channel = await Channel.findById(req.channel?._id);

    console.log(channel);
    
    if(!channel){
        throw new ApiError(404, "Channel not found", { channelId : req.channelOwner?._id });
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

    const channel = await Channel.findById(req.channel?._id);
    
    if(!channel){
        throw new ApiError(404, "Channel not found", { channelId : req.channel?._id });
    }

    channel.description = description;

    await channel.save({ validateBeforeSave : false });

    return res.status(200).json(new ApiResponse(200, "Channel description changed successfully", channel));
});


export {
    createChannel,
    changeChannelName,
    changeDescription,
}
