import {Router} from 'express';
import { registeruser } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js'
import { loginUser,logoutUser } from '../controllers/user.controller'
import {verifyjwt} from '../middlewares/auth.middleware.js'
const router = Router()
// middleware "upload" inserted before getting response "register"
router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverimage",
            maxCount : 1
        }
    ]),
    registeruser)

router.route('/login').post(loginUser)
router.route('/logout').post(verifyjwt,loginUser)
export default router