import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as cookie from "cookie";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

interface DecodedToken {
  userId: string;
}

export const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return res.status(401).send("No token provided!");
  }

  let cookies: Record<string, string | undefined>;
  try {
    cookies = cookie.parse(cookieHeader);
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: "Malformed cookie header",
      err
    });
  }

  const token = cookies["jwt"];
  if (!token) {
    return res.status(401).send("Token not found in cookies!");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (decoded && decoded.userId) {
      req.userId = decoded.userId;
      return next();
    } else {
      return res.status(401).send("Invalid token payload!");
    }
  } catch (e) {
    return res.status(404).json({
      message: "Internal server error",
      e,
    });
  }
};