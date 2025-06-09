"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("./models/user.model"));
const utils_1 = require("./lib/utils");
const db_1 = require("./db");
const dotenv_1 = __importDefault(require("dotenv"));
const content_model_1 = require("./models/content.model");
const linkShare_model_1 = require("./models/linkShare.model");
const protectRoute_1 = require("./middlewares/protectRoute");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const PORT = process.env.SERVER_PORT;
const URL = process.env.CLIENT_URL;
const corsOptions = {
    origin: [`${URL}`],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.post("/api/v1/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required!",
            });
        }
        ;
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 Character",
            });
        }
        else if (password.length >= 100) {
            return res.status(400).json({
                message: "Password must be of maximum 100 Character",
            });
        }
        ;
        const findUser = await user_model_1.default.findOne({ email });
        if (findUser) {
            return res.status(400).json({
                message: "Email already exists, Try signin in!",
            });
        }
        ;
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const newUser = await user_model_1.default.create({
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
        });
        if (newUser) {
            (0, utils_1.generateToken)(newUser._id.toString(), res);
            await newUser.save();
            return res.status(200).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else {
            return res.status(411).json({
                message: "User exists, Try signin in!",
            });
        }
        ;
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error,
        });
    }
});
app.post("/api/v1/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await user_model_1.default.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                message: "Invalid credentials",
            });
        }
        ;
        const matchPassword = await bcrypt_1.default.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(411).json({
                message: "Invalid Credentials",
            });
        }
        ;
        (0, utils_1.generateToken)(existingUser._id.toString(), res);
        return res.status(200).json({
            _id: existingUser._id,
            fullName: existingUser.username,
            email: existingUser.email,
            profilePic: existingUser.profilePic,
        });
    }
    catch (e) {
        return res.status(404).json({
            message: "Internal server error",
        });
    }
    ;
});
//@ts-ignore
app.get("/api/v1/content", protectRoute_1.protectRoute, async (req, res) => {
    const userId = req.userId;
    try {
        const content = await content_model_1.Content.find({
            userId: userId,
        }).populate("userId", "username");
        return res.status(200).json({
            content,
        });
    }
    catch (error) {
        return res.status(411).json({
            message: "Internal server error",
            error,
        });
    }
    ;
});
//@ts-ignore
app.post("/api/v1/content", protectRoute_1.protectRoute, async (req, res) => {
    const { link, title, type, description } = req.body;
    console.log("Received content data:", { link, title, type, description });
    try {
        await content_model_1.Content.create({
            link,
            type,
            title,
            description,
            userId: req.userId,
            tags: [],
        });
        return res.status(200).json({
            message: "Content added",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(411).json({
            message: "Internal server error",
            error,
        });
    }
    ;
});
//@ts-ignore
app.post("/api/v1/content", protectRoute_1.protectRoute, async (req, res) => {
    const { contentId } = req.body;
    const userId = req.userId;
    // Input validation
    if (!contentId) {
        return res.status(400).json({ message: "contentId is required" });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
        return res.status(400).json({ message: "Invalid contentId format" });
    }
    try {
        const result = await content_model_1.Content.findOneAndDelete({
            _id: contentId,
            userId: userId,
        });
        if (!result) {
            return res.status(404).json({
                message: "Content not found or you don't have permission to delete it",
            });
        }
        ;
        return res.status(200).json({
            message: "Removed the content successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error,
        });
    }
    ;
});
//@ts-ignore
app.post("/api/v1/brain/share", protectRoute_1.protectRoute, async (req, res) => {
    const share = req.body.share;
    if (share) {
        const existingLink = await linkShare_model_1.Link.findOne({
            userId: req.userId
        });
        if (existingLink) {
            const newHash = (0, utils_1.random)(16);
            existingLink.hash = newHash;
            await existingLink.save();
            res.json({
                hash: newHash,
                message: "Updated shareable link!"
            });
            return;
        }
        const hash = (0, utils_1.random)(16);
        await linkShare_model_1.Link.create({
            userId: req.userId,
            hash: hash,
        });
        res.status(200).json({
            message: "Created the sharable link!",
            hash,
        });
    }
    else {
        await linkShare_model_1.Link.deleteOne({
            userId: req.userId,
        });
        res.status(200).json({
            message: "Removed sharable link!",
        });
    }
    ;
});
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await linkShare_model_1.Link.findOne({
        hash: hash,
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry Invalid Link",
        });
        return;
    }
    const content = await content_model_1.Content.find({ userId: link.userId });
    const user = await user_model_1.default.findById(link.userId);
    if (!user) {
        res.status(411).json({
            message: "User not Found. Error should ideally not happen!",
        });
        return;
    }
    res.status(200).json({
        username: user.username,
        content: content,
    });
});
app.listen(PORT, async () => {
    await (0, db_1.connectDB)();
    console.log(`App is listening on PORT: ${PORT}`);
});
