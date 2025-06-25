import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const userSchema =new mongoose.Schema(
    {
        username:{
            type: String,
            required: true, 
            unique: true,
            trim: true,
            lowercase: true,
            index : true
        },
        email:{
            type: String,
            required: true, 
            unique: true,
            trim: true,
            lowercase: true,
        },
        fullname:{
            type: String,
            required: true, 
            trim: true,
            lowercase: true,
            index : true
        },
        password:{
            type: String,
            required: [true,'password is required']
        },
        coverimage:{
            type: String, // from thirdparty storage url
            
        },
        avatar:{
            type: String, // from thirdparty storage url
            required: true
        },
        refreshToken:{
            type: String,
        },
        watchhistory: [{
            type: mongoose.Schema.Types.ObjectId, // array of video IDs
            ref : 'video'
        }],

    },{timestamps: true}
)
    userSchema.pre('save' , async function (next) {  //do encrypt before saving/loading data , next is used bcz its a middleware, async bcz it takes time due to some complex algorithm cryptography,not arrow function bcz this keyward is not validin arrow funcn we cant get access of usersmodel above
        if(!this.isModified('passward')) return next() ;
        this.passward = bcrypt.hash(this.passward,8)
        next()
    })

    //  making custom method to check user's entered passward with our stored passward
    userSchema.methods.isPasswardcorrect= async function (passward) {
        return await bcrypt.compare(passward,this.passward)
    }
    userSchema.methods.isgeneratingAccesToken = 
     function() {
        return jwt.sign(
            {
                _id : this._id,
                email:this.email,
                username : this.username,
                fullname :this.fullname
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresin : process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    }
     userSchema.methods.isgeneratingRefreshtoken = 
     function() {
        return jwt.sign(
            {
                _id : this._id,
                email:this.email,
                username : this.username,
                fullname :this.fullname
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresin : process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    }
const User = mongoose.model("User", userSchema);
export default User;