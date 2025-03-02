import express from 'express'
import { registerContoller, loginContoller } from '../controller/authenticationController';

const authenticationRouter = express.Router()

authenticationRouter.post('/register', registerContoller)
authenticationRouter.post('/login', loginContoller)
 

export default authenticationRouter;

