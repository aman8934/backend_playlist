import jwt from'jsonwebtoken'
import { asynchandler } from '../utils/asynchandler'
import { ApiError } from '../utils/ApiError'
import User from '../model/user.model.js'


const verifyjwt = asynchandler( async (req,res,next) =>{
    try {
        const token =req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token) {
            throw new ApiError(401,"Unauthorize request")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password  -refreshToken")
    
        if(!user){
            throw new ApiError (401,"Invalid Access token")
        }
    //  add new object user in request
        req.user=user
        next()
    } catch (error) {
        throw new ApiError(401,error.message || "Invalid access token")
    }
})

export {verifyjwt}