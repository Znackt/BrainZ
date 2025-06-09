import jwt from "jsonwebtoken";
import { Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
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

export const random = (len: number): string => {
  return [...Array(len)]
    .map(() => Math.random().toString(36)[2]) // base-36 gives 0-9 + a-z
    .join("");
};
