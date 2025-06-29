import { asynchandler } from "../utils/asynchandler.js"
import {ApiError} from '../utils/ApiError.js'
import { User} from "../model/user.model.js"
import  {uploadonCloudinary}  from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/Apiresponse.js'
import jwt from 'jsonwebtoken'


const generateAccessandRefreshtoken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if(!user){
            throw new ApiError(404,"user not found");

        }
        const accessToken=await user.isgeneratingAccesToken()
        // accessToken will be provide to user
        const refreshToken=await user.isgeneratingRefreshToken()
        //  refreshToken willbe in database user shouldn't be asked for password after just accessToken expiry
        // add this in database
       
        user.refreshToken =refreshToken
        
    // note before saving this info we hv to check all the other info should be satisfied ex- password should be there (required)
        await user.save({ validateBeforeSave: false })
        
        
        return {accessToken ,refreshToken}

    } catch (error) {
        throw new ApiError(500,"something went wrong while creating token")
    }
}

const registeruser = asynchandler(async (req,res) => {
  /*   // get user detail fro frontend
    //  validation - and no empty
    check user already exist or not
    check for images and avatar
    upload them to cloudinary return back
    create user object -create entry in database
    remove passward and refresh token only from response(database) and rest of them return to client
    check for user creation successfully or not
    return response

    */


    // user details from frontend

    const {fullname,email,username,password}  =req.body

    console.log('email :' ,email);

    // validation
   
     if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    console.log(req.files);
    
    const avatarLocalpath = req.files?.avatar[0]?.path;  // this file on server not on cloudinary
    
    let coverimageLocalpath;
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverimageLocalpath = req.files.coverimage[0].path
    }
    if(!avatarLocalpath )
        throw new ApiError(400 , 'avatar file is required')
    // send to cloudinary
    const avatar =await uploadonCloudinary(avatarLocalpath)
    const coverimage =await uploadonCloudinary(coverimageLocalpath)
    // check fle uploaded succes... on cloudinary
    if(!avatar){
        throw new ApiError(400 , "Avatar file is required")
    }
    // to store new User on db
    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverimage : coverimage?.url || "",
        email,
        password,
        username : username.toLowerCase() 
    })

    // check user on db by id which is auto created by mongodb
    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createduser){
        console.log("error in creating user");
        
        throw new ApiError(500,'error doing registering the user')
    }
    // return the response
    return res.status(201).json(
        new ApiResponse(200, createduser, "User registered successfully")
    )
})
// login
const loginUser = asynchandler(async (req,res) => {
    const {email,username,password} =req.body
    // You can see this output in your terminal where your Node.js server is running.
    // If you use VS Code, it will appear in the "Terminal" tab, not the "Debug Console" unless you are running in debug mode.
    console.log(email);
    
    if(!username &&  !email){
        throw new ApiError(400, "username or email required")
    }
    const user = await User.findOne({
        $or :  [{username} , {email}]
    })
    if(!user){
        throw new ApiError(404,"user doesn't exist")
    }
    const isPasswordvalid= await user.isPasswordcorrect(password)
     if(!isPasswordvalid){
        throw new ApiError(401,"password is incorrect")
    }
    console.log("reach to token",user._id);
   
   
    
   
    const {accessToken,refreshToken} =await generateAccessandRefreshtoken(user._id)

    const loggedInUser =await  User.findById(user._id).select("-password  -refreshToken")
    // send cookies
    const options ={
        // modificattion of cookies by server only not by frontend then
        httpOnly : true,
        secure : true
    }

    res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    )
})


const logoutUser =asynchandler(async (req,res) => {
    User.findByIdAndUpdate(
        req.user._id,
        // delete refreshtoken
        {
            $unset : {
                refreshToken : 1
            }
            // updated response
            
        },
        {
                new : true
            }
    )
    const options ={
        // modificattion of cookies by server only not by frontend then
        httpOnly : true,
        secure : true
    }
    res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {} ,"User logged Out"))
})


const refreshAccessToken = asynchandler(async (req , res) => {
    const incomingrefreshToken= req.cookies.refreshToken || req.body.refreshToken
if(!incomingrefreshToken){
    throw new ApiError(404,"refreshtoken not generate")
}
try {
    const decodedToken = jwt.verify(incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
    const user =await User.findById(decodedToken?._id)
    
    if(!user){
        throw new ApiError(401,"invalid refreshToken")
    }
    
    if(incomingrefreshToken !== user?.refreshToken){
        throw new ApiError(401 , " refresh token is expired")
    }
    //  now generate 
    const options = {
        httpOnly : true,
        secure : true
    }
    const {accessToken, newrefreshToken} = await generateAccessandRefreshtoken(user._id)
    
    
        return res
        .status(200)
        .cookie("accessToken" , accessToken , options)
        .cookie("refresh", newrefreshToken ,options)
        .json(
            new ApiResponse(
                200,{ accessToken , refreshToken : newrefreshToken},"Access token refreshed"
            )
        )
} catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token")
}
})

export {registeruser,loginUser ,logoutUser,refreshAccessToken}