import mongoose from "mongoose";
import mongooseAggregatePginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new mongoose.Schema(
    {
        videofile:{
            type: String, // from third-party storage URL
            required: true
        },
        thumbnail:{
            type: String, // from third-party storage URL
            required: true
        },
        title:{
            type: String, // from third-party storage URL
            required: true
        },
        descriptiom:{
            type: String, // from third-party storage URL
            required: true
        },
        duration:{
            type: Number, // we will get from third-party like aws
            required: true
        },
        views :{
            type: Number, //
            default: 0
        },
        isPublished :{
            type: Boolean, // if video is published or not
            default: true
        },
        owner :{
            type: mongoose.Schema.Types.ObjectId, // reference to user
            ref: 'User',
            required: true
        }
        
    },{timestamps: true}
)
    videoSchema.plugin(mongooseAggregatePginate)
    
 const Video = mongoose.model('Video',videoSchema)
     export default Video
