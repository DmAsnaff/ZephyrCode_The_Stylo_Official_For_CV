import express from 'express'
import {feedbackHandler} from '../controller/feedbackController';

const Router = express.Router()

Router.post('/feedback', feedbackHandler)


export default Router;
