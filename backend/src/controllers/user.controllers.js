import asyncHandler  from '../utils/asyncHandler.js';

import { User } from '../models/user.models.js';

import  ApiResponse from '../utils/ApiResponse.js';

import  uploadOnCloudinary  from '../utils/cloudinary.js';

import  ApiError  from '../utils/ApiError.js';


const generateAccessAndRefreshTokens = async(userId) =>{
    try{
        const user = await User.findById(userId);
        const accessToken = user.accessToken();
        const refreshToken = user.refreshTokens();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave : false });

        return { accessToken, refreshToken };
    }

    catch(error){
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens", { error });
    }
}

const registerUser = asyncHandler( async(req, res) =>{
    const{ userName, email, password, fullName } = req.body;

    if([userName, email, password, fullName].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required", { userName, email, password, fullName });
    }

    const existedUser = await User.findOne({
        $or : [{userName}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists", { userName, email });
    }

    let profilePictureLocalPath = req.files?.profilePicture?.[0]?.path;
    let coverImageLocalPath = req.files?.coverImage?.[0]?.path 
    let avatarLocalPath = req.files?.avatar?.[0]?.path ;

    // console.log(profilePictureLocalPath, coverImageLocalPath, avatarLocalPath);

    if(!profilePictureLocalPath){
        throw new ApiError(400, "Profile picture is required", { profilePictureLocalPath });
    }

    const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
    if(!profilePicture){
        throw new ApiError(400, "Profile picture upload failed", { profilePictureLocalPath });
    }  

    let coverImage;
    if(coverImageLocalPath){
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
        if(!coverImage){
            throw new ApiError(400, "Cover image upload failed", { coverImageLocalPath });
        }
    }

    let avatar;
    if(avatarLocalPath){
        avatar = await uploadOnCloudinary(avatarLocalPath);
        if(!avatar){
            throw new ApiError(400, "Avatar upload failed", { avatarLocalPath });
        }
    }

    const user = await User.create({
    userName,
    email,
    password,
    fullName,
    profilePicture : profilePicture.url,
    coverPicture : coverImage?.url || "",
    avatar : avatar?.url || '',
    });



    const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken "
    );

    if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user", { userName, email });
    }

    return res.status(201).json(
    new ApiResponse(200, "User registered successfully", createdUser)
    );
});

const loginUser = asyncHandler( async(req, res) =>{
    const { userName, email, password } = req.body;
    
    if( userName === "" && email === ""){
        throw new ApiError(400, "Username or email is required", { userName, email });
    }

    const user = await User.findOne({
        $or : [{userName}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User not found", { userName, email });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password", { userName, email });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?._id);

    const loggedInUser = await User.findById(user?._id).select(
        "-password -refreshToken"
    );

    if(!loggedInUser){
        throw new ApiError(500, "Something went wrong while logging in the user", { userName, email });
    }

    return res.status(200).json(
        new ApiResponse(200, "User logged in successfully", {
            user : loggedInUser,
            accessToken,
            refreshToken,
        })
    )
});

const logoutUser = asyncHandler( async(req, res) =>{
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                refreshToken : "",
            }
        },

        {
            new : true,
        }
    )

    const cookieOption = {
        httpOnly : true,
        secure : true,
    }


    return res.status(200)
    .clearCookie("accessToken", cookieOption)
    .clearCookie("refreshToken", cookieOption)
    .json(
        new ApiResponse(200, "User logged out successfully", {})
    )
});

const updatePassword = asyncHandler( async( req, res) =>{
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if(!(oldPassword || newPassword )){
        throw new ApiError(400, "All fields are required", { oldPassword, newPassword });
    }

    if(newPassword !== confirmPassword){
        throw new ApiError(400, "New password and confirm password do not match", { newPassword, confirmPassword });
    }

    const user = await User.findById(req.user?._id);

    if(!user){
        throw new ApiError(404, "User not found", { oldPassword, newPassword });
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid old password", { oldPassword, newPassword });
    }

    user.password = newPassword;

    const savepassword = await user.save({ validateBeforeSave : false });

    if(!savepassword){
        throw new ApiError(500, "Something went wrong while updating the password", { oldPassword, newPassword });
    }

    console.log("savePassword ", savepassword);


    return res.status(200).json(
        new ApiResponse(200, "Password updated successfully", {})
    )
});

const updateProfilePicture = asyncHandler( async(req, res) =>{
    const profilePictureLocalPath = req.file?.path;
    if(!profilePictureLocalPath){
        throw new ApiError(400, "Profile picture is required", { profilePictureLocalPath });
    }

    const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
    if(!profilePicture){
        throw new ApiError(400, "Profile picture upload failed on cloudinary", { profilePictureLocalPath });
    }

    const user = await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(404, "User not found", { profilePictureLocalPath });
    }

    user.profilePicture = profilePicture.url;
    await user.save({ validateBeforeSave : false });

    return res.status(200).json(
        new ApiResponse(200, "Profile picture updated successfully", {})
    )
});

const updateCoverPicture = asyncHandler( async (req, res) =>{
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover image is required", { coverImageLocalPath });
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!coverImage){
        throw new ApiError(400, "Cover image upload failed", { coverImageLocalPath });
    }

    const user = await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(404, "User not found", { coverImageLocalPath });
    }

    user.coverPicture = coverImage.url;
    await user.save({ validateBeforeSave : false });

    return res.status(200).json(
        new ApiResponse(200, "Cover image updated successfully", {})
    )
});

const upadateAvatar = asyncHandler( async(req, res) =>{
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required", { avatarLocalPath });
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar){
        throw new ApiError(400, "Avatar upload failed", { avatarLocalPath });
    }

    const user = await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(404, "User not found", { avatarLocalPath });
    }

    user.avatar = avatar.url;
    await user.save({ validateBeforeSave : false });

    return res.status(200).json(
        new ApiResponse(200, "Avatar updated successfully", {})
    )
});

const updateEmailid = asyncHandler( async(req, res) =>{
    const { oldEmailId, newEmailId } = req.body;

    if( !oldEmailId || !newEmailId ){
        throw new ApiError(401, "All field is required");
    }

    const user = User.findById(oldEmailId?._id);

    if(!user){
        throw new ApiError(401, "Unauthourised access ");
    }

    user.oldEmailId = newEmailId;

    await user.save({validateBeforeSave :  false});

    return res.status(201).json(
        new ApiResponse(201, "Email id  Update successfully ", newEmailId)
    )
});

const getProfile = asyncHandler( async(req, res) =>{
    const user = await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const currentUser = await User.findById(req.user?._id).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, "User profile fetched successfully", currentUser)
    )
});

const refreshAccessToken = asyncHandler( async(req, res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, 'Unauthorized request' );
    }

    try{
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);

        const user = await User.findById(decodedToken?._id);    
        if(!user){
            throw new ApiError(401, 'Invalid refresh token')
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, 'Refresh token is expired or used')
        }

        const { accessToken, refreshToken: newRefreshToken } =  await generateAccessAndRefreshTokens(user._id);

        const cookieOption = {
            httpOnly : true,
            secure : true,
        }

        return res.status(200)
        .cookie("accessToken", accessToken, cookieOption)
        .cookie("refreshToken", newRefreshToken, cookieOption)
        .json(
            new ApiResponse(200, "Access token refreshed successfully", { accessToken, refreshToken: newRefreshToken })
        )
    } 
    
    catch (error) {
        throw new ApiError(401, error?.message || 'Invalid refresh token');
    }
});


export {
    registerUser,
    loginUser,
    logoutUser,
    updatePassword,
    updateProfilePicture,
    updateCoverPicture,
    upadateAvatar,
    updateEmailid,
    getProfile,
    refreshAccessToken,
}
