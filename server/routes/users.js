import express from "express";
import { getUser, getUserFriends, addRemoveFriend } from '../controllers/users.js';
import { verifyToken } from "../middleware/auth.js";

const routes = express.Router();


routes.get('/:id', verifyToken, getUser);
routes.get('/:id/friends',verifyToken, getUserFriends);


routes.patch('/:id:friendId', verifyToken , addRemoveFriend);


export default routes;