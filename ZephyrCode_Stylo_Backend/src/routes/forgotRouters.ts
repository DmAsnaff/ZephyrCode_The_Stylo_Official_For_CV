import express from 'express'
import { forgotPassword, verifyCode, resetPassword } from '../controller/forgotcontroller';

const forgetRouter = express.Router()

forgetRouter.post('/forgotPassword', forgotPassword);
forgetRouter.post('/verifyCode', verifyCode);
forgetRouter.post('/resetPassword', resetPassword);


export default forgetRouter;

