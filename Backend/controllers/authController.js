const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const generateToken = require('../utils/tokenGenerate');
const user = require('../models/user');




exports.registerUser = async (req, res) => {

    let { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "Use with this email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = generateToken(user);
        return res.status(201).json({
            message: "User registered successfully",
            access: token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server error", error: error.message });

    }
}



exports.loginUser = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "Invalid Credentials" });
        const result = await bcrypt.compare(password, user.password);

        if (!result) return res.status(404).json({ message: "Invalid Credentials" });
        const token = generateToken(user);
        return res.status(200).json({
            message: "User logged in successfully",
            access: token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server error", error: error.message });

    }
}


exports.getUser = async (req, res) => {
    const { userid } = req.user;
    try {
        const user = await userModel.findById({ _id: userid });
        if (user) return res.status(200).json({
            userData: {
                userid,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
        return res.status(400).json({ message: "Failed to fetch user details" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server error", error: error.message });

    }
}


exports.updateUser = async (req, res) => {
    const { userid } = req.user;
    const { name, email, phone } = req.body;

    const updatedUser = {};
    if (name !== undefined) updatedUser.name = name;
    if (email !== undefined) updatedUser.email = email;
    if (phone !== undefined) updatedUser.phone = phone;
    try {
        const user = await userModel.findByIdAndUpdate(
            userid,
            { $set: updatedUser },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: "Failed to update user" });
        }

        return res.status(200).json({
            message: "User updated successfully",
            user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};
