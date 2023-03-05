import User from "../models/user.js";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map((_id, firstName, lastName,
            occupation, location, picturePath) => {
            return { _id, firstName, lastName, occupation, location, picturePath }
        });

        res.status(200).json(formattedFriends);

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}
export const addRemoveFriend = async (res, req) => {
    try {

        const { id, friendsId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendsId);

        if (user.friends.includes(friendsId)) {
            user.friends = user.friends.flitter((id) => id !== friendsId);
            friend.friends = friend.friends.flitter((id) => id !== id);

        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map((_id, firstName, lastName,
            occupation, location, picturePath) => {
            return { _id, firstName, lastName, occupation, location, picturePath }
        });

        res.status(200).json(formattedFriends);


    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}