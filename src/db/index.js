import mongoose from "mongoose";
import { DB } from "../constants.js";

const connectdb = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB}`)
        console.log(`\n MONGODB CONNECTED !! DB HOST: ${connection.connection.host} \n`
           
        );
            
    } catch (error) {
        console.error('ERROR:', error);
        process.exit(1);
    }
}

export default connectdb;
