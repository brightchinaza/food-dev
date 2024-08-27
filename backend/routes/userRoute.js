import express from "express"
import { loginUser,registerUser, getUserDetails, getEditUserDetails, updateUserInfo } from "../controllers/userController.js"

const userRouter = express.Router()

// userRouter.post('/login',registerUser)
// userRouter.get('/login',loginUser)
// userRouter.get('/login',getUserDetails)
userRouter.post('/register', registerUser);   // Register a new user
userRouter.post('/login', loginUser);         // Login user
userRouter.get('/userDetails', getUserDetails); // Get user details
userRouter.get('/userEditDetails/:id', getEditUserDetails); // Get user details
// Update user details route
userRouter.put('/updateDetails/:id', updateUserInfo);




export default userRouter;