import { User } from "../models/UserModel.js";
import cookie from "cookie-parser";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";
import { TokenExpiredError } from "jsonwebtoken";
export const registerController = async(req, res, next) => {
    const { name, email, password, address, city, country, answer, phone, role } =
    req.body;
    if (!name ||
        !email ||
        !password ||
        !address ||
        !city ||
        !country ||
        !phone ||
        !answer
    )
        return res.status(400).send({
            success: false,
            message: "please Enter All Fields",
        });
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                succes: false,
                message: "these email is already used",
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            address,
            city,
            answer,
            country,
            phone,
            role,
        });

        res.status(201).json({
            succes: true,
            message: "user created succesfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes: false,
            messgae: "Error in user register",
            error,
        });
    }
};
export const loginController = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.send("please enter email or password");

        const user = await User.findOne({ email });

        if (!user) return res.send("user not found");
        const ISmatch = await user.comparePassword(password);
        if (!ISmatch) return res.send("invalid details");

        const token = user.generateToken();
        res
            .status(200)
            .cookie("token", token, {
                expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                secure: process.env.NODE_ENV === "Development" ? true : false,
                httpOnly: process.env.NODE_ENV === "Development" ? true : false,
                sameSite: process.env.NODE_ENV === "Development" ? true : false,
            })
            .json({
                succes: true,
                message: "you are login",
                token,
                user,
            });
    } catch (error) {
        return console.log(error);
        return res.status(400).json({
            succes: false,
            message: "error in login",
        });
    }
};

export const UserProfileController = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.password = undefined;
        return res.status(401).send({
            succes: true,
            message: "user profile fatched suceesfully",
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            succes: false,
            message: "Internal server Error",
            error,
        });
    }
};

export const UserLogout = async(req, res, next) => {
    try {
        return res
            .status(201)
            .cookie("token", "", {
                expire: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                secure: process.env.NODE_ENV === "Development" ? true : false,
                httpOnly: process.env.NODE_ENV === "Development" ? true : false,
                sameSite: process.env.NODE_ENV === "Development" ? true : false,
            })
            .send({
                succes: true,
                message: "user logout succesfully",
            });
    } catch (error) {
        console.log(error);
        return res.status().send({
            succes: false,
            message: "error in logout api",
        });
    }
};

export const updateUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const { name, email, password, address, city, country, phone, profilePic } =
        req.body;
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;
        if (address) user.address = address;
        if (city) user.city = city;
        if (country) user.country = country;
        if (phone) user.phone = phone;
        if (profilePic) user.profilePic = profilePic;

        await user.save();

        return res.status(201).send({
            succes: true,
            message: "user updated successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes: false,
            message: "Error In Update User",
        });
    }
};

export const UpdatePassword = async(req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword)
            return res.status(500).send({
                succes: false,
                message: "missing oldPassword or newPassword",
            });
        const user = await User.findById(req.user._id);

        const isMatch = await user.comparePassword(oldPassword);

        if (!isMatch)
            return res.status(500).send({
                succes: false,
                message: "invalid oldPassword",
            });
        user.password = newPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "Password Updated Succesfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes: true,
            message: "Error in Update Password",
        });
    }
};

export const UpdateProfilePicController = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const file = getDataUri(req.file);

        if (!file)
            return res.status(400).send({
                success: false,
                message: "file is compulsory",
            });
        // delete previous image
        if (user.profilePic.public_id) {
            await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
        }
        // update image

        const cdb = await cloudinary.v2.uploader.upload(file.content);
        user.profilePic = {
            public_id: cdb.public_id,
            url: cdb.secure_url,
        };

        // save function calling

        await user.save();

        res.status(200).send({
            succes: true,
            message: "Profile pic updated succefully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes: true,
            message: "Error in Update Profile pic API ",
        });
    }
};

export const ResetPassword = async(req, res, next) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email || !answer || !newPassword)
            return res.status(500).send({
                success: false,
                message: "please enter all fields ",
            });
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).send({
                success: false,
                message: "Invalid email",
            });

        if (user.answer != answer)
            return res.status(400).send({
                success: false,
                message: "answer is incorrect",
            });

        user.password = newPassword;

        await user.save();
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            succes: false,
            message: "Error in Reset Password API",
        });
    }
};