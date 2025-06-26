import multer from 'multer'
// req is coming from user
// dest is destination where file should store
// cb is callback
// this multer.middleware.js is used for store the files as temporary file and then send these file to cloudinary 
// text files are handled in express folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

export const upload = multer(
    {
         storage: storage 
    })