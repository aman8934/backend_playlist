// require('dotenv').config({path: '/env'})
// import dotenv from 'dotenv'
// import connectdb from './db/index.js'
// import mongoose from 'mongoose'

import connectdb from './db/index.js'
import dotenv from 'dotenv'
import {app} from './app.js'

dotenv.config({ path: './env' })

connectdb()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`\n App is listening on port ${process.env.PORT} \n`);
    });
})
.catch((error) => {
    console.error('failed while connecting with db', error);

});

 
// import express from 'express'

// const app=express()
// ( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB}`)
//         app.on("error",(error) => {
//             console.log("error",error);
//             throw error
            
//         })
//         app.listen(process.env.PORT, () =>{
//             console.log(`app is listning ${process.env.PORT}`);
            
//         })
//     } catch (error) {
//         console.error('ERROR:',error)
//         throw error
//     }
// })()