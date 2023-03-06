import express from "express";
import {getFeedPosts, getUserPosts, likePost} from '../controllers/posts.js'
import { verifyToken } from "../middleware/auth.js";


const routes = express.Router()


routes.get('/', verifyToken, getFeedPosts);
routes.get('/:userId/posts/', verifyToken, getUserPosts);
routes.patch('/:id/like', verifyToken, likePost);

export default routes;