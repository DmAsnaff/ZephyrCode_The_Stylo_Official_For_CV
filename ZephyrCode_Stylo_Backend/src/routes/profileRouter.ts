import express from 'express'
import {getUserDetails, updateUserProfile} from '../controller/profileController';

const profileRouter = express.Router()

profileRouter.post('/userProfile', getUserDetails)
profileRouter.post('/updateUserProfile', updateUserProfile)


export default profileRouter;
