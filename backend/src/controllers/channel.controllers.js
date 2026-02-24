import  asyncHandler  from '../utils/asyncHandler.js';

import  ApiResponse  from '../utils/ApiResponse.js';

import ApiError  from '../utils/ApiError.js';

import { Channel } from '../models/channel.models.js';


const createChannel = asyncHandler( async(req, res) =>{
    const { name, description } = req.body;

    if(!name){
        throw new ApiError(400, "Channel name is required", { name });
    }

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
    const { newChannelName } = req.body;

    if (!newChannelName || !newChannelName.trim()) {
        throw new ApiError(400, "New channel name is required");
    }
    
    const changeChannelName = await Channel.findByIdAndUpdate(
        req.channel?._id,
        { name : newChannelName.trim() },
        { new : true }
    )

    if(changeChannelName.name !== newChannelName.trim()){
        throw new ApiError(400, "Channel name not changed", { newChannelName });
    }

    return res.status(200).json(new ApiResponse(200, "Channel name changed successfully", changeChannelName));
});


const changeDescription = asyncHandler( async(req, res) =>{
    
    const { description } = req.body;

    const channel = await Channel.findById(req.channel?._id);

    console.log(`channel controllers : ${ channel }`);
    
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
