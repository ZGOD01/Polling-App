const User = require("../models/User");
const Poll = require("../models/Polls");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

//Generate JWT Token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

//Register User
exports.registerUser = async (req, res) => {
    const { fullName, username, email, password, profileImageUrl } = req.body;

    //Validation : Check for missing fields
    if (!fullName ||!username ||!email ||!password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    //Validation : Check for existing email
    //Allows alphanumeric characters and hyphens only
    const usernameRegex = /^[a-zA-Z0-9-]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: "Invalid username. Only alphanumeric characters and hyphens are allow . No spaces are permitted " });
    }

    try {
        //Checks if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        } 

        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username not available . Try another one." });
        }

        //Create a new user
        const user = await User.create({
            fullName,
            username,
            email,
            password,
            profileImageUrl,
        });

        res.status(201).json({
            id: user.id,
            user,
            token: generateToken(user.id),
        });
    } catch (err) {
        res.status(500).json({ message: "Error registering user" , error: err.message });
    }
}

// Login User
exports.loginUser = async (req, res) =>{
    const {  email, password} = req.body;  

     //Validation : Check for missing fields
     if ( !email ||!password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(404).json({ message: "Invalid credentail" });
        }

        //count polls created by the user
        const totalPollsCreated = await Poll.countDocuments({ creator: user._id });

        // Count polls the user has voted in
        const totalPollsVotes = await Poll.countDocuments({ voters: user._id });

        // Get the count of the bookmarked poll
        const totalPollsBookmarked = user.bookmarkedPolls.length

        res
        .status(200)
        .json({
            id: user._id,
            user : {
                ...user.toObject(),
                totalPollsCreated ,
                totalPollsVotes ,
                totalPollsBookmarked ,
            },
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: "Error registering user" , error: err.message });
    }

}


// Get User Info 
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }


        //count polls created by the user
        const totalPollsCreated = await Poll.countDocuments({ creator: user._id });

        // Count polls the user has voted in
        const totalPollsVotes = await Poll.countDocuments({ voters: user._id });

        // Get the count of the bookmarked poll
        const totalPollsBookmarked = user.bookmarkedPolls.length

        // Add the new attributes to the response 
        const userInfo = {
            username: user.username,
            ...user.toObject(),
            totalPollsCreated ,
            totalPollsVotes,
            totalPollsBookmarked ,
        }

        res
            .status(200)
            .json(userInfo);
    } catch (err) {
        res.status(500).json({ message: "Error registering user" , error: err.message });
    }
}
