
// wraps async functions to handle errors in Express.js routes
// const asynchandler = (fn) => { async () => {}} same as given below

// promise method
const asynchandler = (fn) => {
    (req,res,next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    }
}










// try_catch method
// const asynchandler = (fn) =>  async(req,res,next) => {
//   try {
//     await fn(req,res,next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message || "Internal Server Error"
//     });
//   }
// }

export {asynchandler };