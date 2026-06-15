const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/Usermodel.js");

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please fill the details"
            });
        }
        const confirmpassword = req.body.confirmPassword || req.body.confirmpassword;
        if (password != confirmpassword) {
            return res.status(401).json({
                success: false,
                message: "password do not match"
            });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "user already exists"
            });
        }
        const user = await User.create({ name, email, password });
        let token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: "10d" });
        res.status(201).json({
            success: true,
            token,
            user: {
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please fill the details"
            });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "please register first"
            });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: "invalid credentials"
            });
        }
        let token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: "10d" });
        res.status(200).json({
            success: true,
            token,
            user: {
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.protect = async (req, res, next) => {
    const authorization = req.headers.authorization;
    try {
        if (!authorization || !authorization.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        let token = authorization.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

