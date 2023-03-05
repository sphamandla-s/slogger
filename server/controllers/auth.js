import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import User from "../models/user.js";

// SIGNUP USER

export const signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation

        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000),
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email : email});
        if(!user) return res.status(400).json({msg : "User Not Found"})
    
        const passwordIsMatch = await bcrypt.compare(password, user.password)
        if(!passwordIsMatch) return res.status(400).json({msg : "incorrect password"});
    
        const token = jwt.sign({id : user._id}, process.env.JWT_SECRETE);
        delete user.password;
    
        res.status(200).json({token, user});
        
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}