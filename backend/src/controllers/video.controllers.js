import { Video } from '../models/video.models.js';
import { Channel } from '../models/channel.models.js';

import ApiResponse from '../utils/ApiResponse.js';

import ApiError from '../utils/ApiError.js';

import asyncHandler from '../utils/asyncHandler.js';    

import  uploadOnCloudinary  from '../utils/cloudinary.js';



const uploadVideo = asyncHandler( async (req, res) =>{
    const videoLocalPath = req.files?.uploadVideo?.[0]?.path;
    console.log(videoLocalPath);

    if(!videoLocalPath){
        throw new ApiError(400, "Video is required", { videoLocalPath });
    }

    const video = await uploadOnCloudinary(videoLocalPath);
    console.log(video);

    if(!video){
        throw new ApiError(400, "Video upload failed", { videoLocalPath });
    }

    // const channel = await Channel.findOne({ owner: req.user?._id });
    // if(!channel){
    //     throw new ApiError(404, "Channel not found for user", { userId: req.user?._id });
    // }

    const videoUser = await Video.create({
        uploadVideo : video.secure_url || "WWW.google.com",
        description : video.signature?.toString() || "First description",
        tags : video.tags || [],
        likes: video.likes || 0,
        views: video.views || 0,
        dislikes: video.dislikes || 0,
        comments: video.comments || 0,
        title: video.original_filename?.toString() || "First title...",
        videoUrl: video.secure_url || "WWW.google.com",
        channel :req.user?._id,
        thumbnailUrl: video.playback_url?.toString() || "WWW.google.com",
        duration: video.duration || 0,
    });

    if(!videoUser){
        throw new ApiError(400, "Video creation failed", { videoLocalPath });
    }

    return res.status(200).json(
        new ApiResponse(200, "Video uploaded successfully", videoUser)
    )
})

const changeTitle = asyncHandler( async(req, res) =>{
    const { title, videoUrl } = req.body;

    const video = await Video.findOne({ videoUrl });

    if(!video){
        throw new ApiError(404, "Video not found", { videoUrl });
    }

    video.title = title;
    await video.save({validateBeforeSave : true});
    
    return res.status(200).json(
        new ApiResponse(200, video, "Title changed successfully")
    );
})

const changeDescription = asyncHandler( async(req, res) =>{
    const { description, videoUrl } = req.body;

    const video = await Video.findOne({ videoUrl });
    
    if(!video){
        throw new ApiError(404, "Video not found", { videoUrl });
    }

    
    video.description = description;
    await video.save({validateBeforeSave : true});
    
    return res.status(200).json(
        new ApiResponse(200, video, "Description changed successfully")
    );
});

const changeTags = asyncHandler( async(req, res) =>{
    const { videoUrl, tags } = req.body;

    const video = await Video.findOne({ videoUrl });

    if(!video){
        throw new ApiError(404, "Video not found", { videoUrl });
    }

    video.tags = tags;
    await video.save({validateBeforeSave : true});
    
    return res.status(200).json(
        new ApiResponse(200, video, "Tags changed successfully")
    );
});

const updateLikes = asyncHandler( async(req, res) =>{
    const { videoUrl, likes } = req.body;

    const video = await Video.findOne({ videoUrl });

    if(!video){
        throw new ApiError(404, "Video not found", { videoUrl });
    }

    video.likes = likes;
    await video.save({validateBeforeSave : true});
    
    return res.status(200).json(
        new ApiResponse(200, video, "Likes changed successfully")
    );
});

const updateViews = asyncHandler( async(req, res) =>{
    const { videoUrl, views } = req.body;

    const video = await Video.findOne({ videoUrl });

    if(!video){
        throw new ApiError(404, "Video not found", { videoUrl });
    }

    video.views = views;
    await video.save({validateBeforeSave : true});
    
    return res.status(200).json(
        new ApiResponse(200, video, "Views changed successfully")
    );
});

const updateDislikes = asyncHandler( async(req, res) =>{
    const { videoUrl, dislikes } = req.body;

    const video = await Video.findOne({ videoUrl });

    if(!video){
        throw new ApiError(404, "Video not found", { videoUrl });
    }

    video.dislikes = dislikes;
    await video.save({validateBeforeSave : true});
    
    return res.status(200).json(
        new ApiResponse(200, video, "Dislikes changed successfully")
    );
});

const upadateComment = asyncHandler( async(req, res) =>{
    const { videoUrl, comment } = req.body;

    const video = await Video.findOne({ videoUrl });

    if(!video){
        throw new ApiError(404, "Video not found", { videoUrl });
    }

    video.comments = comment;
    await video.save({validateBeforeSave : true});
    
    return res.status(200).json(
        new ApiResponse(200, video, "Comments changed successfully")
    );
})


export {
    uploadVideo,
    changeTitle,
    changeDescription,
    changeTags,
    updateLikes,
    updateViews,
    updateDislikes,
    upadateComment,

}
