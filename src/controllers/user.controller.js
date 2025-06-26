import { asynchandler } from "../utils/asynchandler.js"
import {ApiError} from '../utils/ApiError.js'
import { User} from "../model/user.model.js"
import  {uploadonCloudinary}  from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/Apiresponse.js'
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

    console.log(req.file);
    
    const avatarLocalpath = req.files?.avatar[0]?.path;  // this file on server not on cloudinary
    const coverimageLocalpath = req.files?.coverimage[0]?.path;
    if(!avatarLocalpath )
        return new ApiError(400 , 'avatar file is required')
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
    const createduser = User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createduser){
        throw new ApiError(500,'error doing registering the user')
    }
    // return the response
    return res.status(201).json(
        new ApiResponse(200,createduser , "User registerd successfully")
    )
})


export {registeruser}