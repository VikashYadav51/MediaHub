import  ApiError  from "../utils/ApiError.js";

import asyncHandler from "../utils/asyncHandler.js";

import jwt from "jsonwebtoken";

import { User } from "../models/user.models.js";    



const verifyJWT = asyncHandler( async(req, res, next) =>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    // console.log("Authorization header:", req.headers.authorization);
    // console.log("Token type:", typeof token);
    // console.log("Token value:", token);


    if(!token){
        throw new ApiError(401, 'unauthorised Access', token)
    }

    const decodedInformation =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET );

    if(!decodedInformation){
        throw new ApiError(401, 'Decoded information did not matched', decodedInformation);
    }

    const user = await User.findById(decodedInformation?._id).select("-password -refreshToken");;

    if(!user){
        throw new ApiError(401, 'Invalid Access Token ', user);
    }

    req.user = user;

    next();
});


export default verifyJWT;

