import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "./models/user.model";
import { generateToken, random } from "./lib/utils";
import { connectDB } from "./db";
import dotenv from "dotenv";
import { Content } from "./models/content.model";
import { Link } from "./models/linkShare.model";
import { protectRoute } from "./middlewares/protectRoute";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.SERVER_PORT;
const URL = process.env.CLIENT_URL;

if (!URL) {
  console.log("URL NOT PRESENT")
}

const corsOptions = {
  origin:  [`${URL}`],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.post("/api/v1/signup", async (req: Request, res: any) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    };

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 Character",
      });
    } else if (password.length >= 100) {
      return res.status(400).json({
        message: "Password must be of maximum 100 Character",
      });
    };

    const findUser = await User.findOne({ email });

    if (findUser) {
      return res.status(400).json({
        message: "Email already exists, Try signin in!",
      });
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id.toString(), res);
      await newUser.save();

      return res.status(200).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(411).json({
        message: "User exists, Try signin in!",
      });
    };
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
});
app.post("/api/v1/signin", async (req: Request, res: any) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        message: "Invalid credentials",
      });
    };

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(411).json({
        message: "Invalid Credentials",
      });
    };

    generateToken(existingUser._id.toString(), res);

    return res.status(200).json({
      _id: existingUser._id,
      fullName: existingUser.username,
      email: existingUser.email,
      profilePic: existingUser.profilePic,
    });
  } catch (e) {
    return res.status(404).json({
      message: "Internal server error",
    });
  };
});
//@ts-ignore
app.get("/api/v1/content", protectRoute, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const content = await Content.find({
      userId: userId,
    }).populate("userId", "username");
    return res.status(200).json({
        content,
    });
  } catch (error) {
    return res.status(411).json({
      message: "Internal server error",
      error,
    });
  };
});

//@ts-ignore
app.post("/api/v1/content", protectRoute, async (req: Request, res: Response) => {
    const { link, title, type, description } = req.body;
    console.log("Received content data:", { link, title, type, description });

    try {
      await Content.create({
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
    } catch (error) {
      console.log(error);
      return res.status(411).json({
        message: "Internal server error",
        error,
      });
    };
  }
);
//@ts-ignore
app.delete("/api/v1/content", protectRoute, async (req: Request, res: Response) => {
    const { contentId } = req.body;
    const userId = req.userId;

    // Input validation
    if (!contentId) {
        return res.status(400).json({ message: "contentId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return res.status(400).json({ message: "Invalid contentId format" });
    }

    try {
      const result = await Content.findOneAndDelete({
        _id: contentId,
        userId: userId,
      });

      if (!result) {
        return res.status(404).json({
          message: "Content not found or you don't have permission to delete it",
        });
      };

      return res.status(200).json({
        message: "Removed the content successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error,
      });
    };
  }
);
//@ts-ignore
app.post("/api/v1/brain/share", protectRoute, async (req: Request, res: Response) => {
    const share = req.body.share;

    if (share) {
      const existingLink = await Link.findOne({
        userId: req.userId
      });

      if (existingLink) {
        const newHash = random(16);
        existingLink.hash = newHash;
        await existingLink.save();
        res.json({
          hash: newHash,
          message: "Updated shareable link!"
        });
        return;
      }
      const hash = random(16);
      await Link.create({
        userId: req.userId,
        hash: hash,
      });

      res.status(200).json({
        message: "Created the sharable link!",
        hash,
      });
    } else {
      await Link.deleteOne({
        userId: req.userId,
      });
      res.status(200).json({
        message: "Removed sharable link!",
      });
    };
  }
);
app.get("/api/v1/brain/:shareLink", async (req: Request, res: Response) => {
  const hash = req.params.shareLink;

  const link = await Link.findOne({
    hash: hash,
  });

  if (!link) {
    res.status(411).json({
      message: "Sorry Invalid Link",
    });
    return;
  }

  const content = await Content.find({userId: link.userId});

  const user = await User.findById(link.userId);

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
  await connectDB();
  console.log(`App is listening on PORT: ${PORT}`);
});
