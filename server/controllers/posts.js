import Post from "../models/post.js";
import User from "../models/user.js";


export const createPost = async (req, res) => {
    try {
        const { userId, blog, picturePath } = req.body;
        const user = User.findById(userId);

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            blog,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            Comment: []
        });

        await newPost.save();

        const post = Post.find();
        res(201).json(post);
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {

        const { userId } = req.params;
        const posts = await Post.find({ userId });
        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};


export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId)

        if (isLiked) {
            post.likes.delete(userId)
        } else {
            post.likes.set(userId, true)
        }

        const updatePost = post.findByIdAndUpdate(id, { likes: post.likes }, { new: true })

        res.status(200).json(updatePost);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};