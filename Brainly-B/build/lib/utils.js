"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateToken = (userId, res) => {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
    res.cookie("jwt", token, {
        maxAge: 30 * 24 * 60 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV != "development",
    });
    return token;
};
exports.generateToken = generateToken;
const random = (len) => {
    return [...Array(len)]
        .map(() => Math.random().toString(36)[2]) // base-36 gives 0-9 + a-z
        .join("");
};
exports.random = random;
