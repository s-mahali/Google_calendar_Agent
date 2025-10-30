import express from "express";
import { google } from "googleapis";
import User from "./models/userModel.ts";
import { connectDB } from "./config/mongodb.js";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "./middleware/authMiddleware.js";
import { calendarService, getCheckpointer, initializeAgent } from "./index.js";
import crypto from "crypto";
import { decrypt, encrypt } from "./utils/decipher.ts";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import Session from "./models/sessionModel.ts";

const app = express();
const corsOption = {
  origin: ["https://google-calendar-agent.vercel.app", 'http://localhost:5173'],
  credentials: true,
  
};

app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());


export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const calendar = google.calendar({ version: "v3", auth: oauth2Client });
let key = crypto
  .createHash("sha256")
  .update(process.env.DECIPHER_SECRET as string)
  .digest("base64")
  .substr(0, 32);

type ReqUser = {
  id: string;
  email: string;
  username: string;
};

app.get("/", (_, res) => {
  res.status(200).json({
    message: "Namste",
  });
});

app.get("/auth", (_, res) => {
  //res.send("hello world")
  //generate a link
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    prompt: "consent",
    // If you only need one scope, you can pass it as a string
    scope: scopes,
  });

  console.log("url", url);
  res.redirect(url);
});

app.get("/google-callback", async (req, res) => {
  try {
    const code = req.query.code;
    //exhange code with access token and refresh token
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    //encrypt refresh_token
    const encryptedRefreshToken = encrypt(tokens.refresh_token as string, key);
    const userExist = await User.findOne({ email: data.email });
    let token = "";
    if (userExist) {
      token = userExist.generateToken();
    } else {
      const newUser = await User.create({
        email: data.email,
        username: data.name,
        refreshToken: encryptedRefreshToken,
      });

      token = newUser.generateToken();
    }

    console.log("token", token);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //1week
    });
    
    if(process.env.NODE_ENV === 'DEV'){
      console.log("if", process.env.NODE_ENV)
      return res.redirect("http://localhost:5173/new");
    }else{
      console.log("else", process.env.NODE_ENV)
      return res.redirect("https://google-calendar-agent.vercel.app/new");
    }
  } catch (error) {
    console.error("error", error);
    return res.redirect("https://google-calendar-agent.vercel.app/error");
  }
});

app.post("/refresh-token", (req, res) => {
  const oldToken = req.cookies?.token;
  if (!oldToken) {
    return res.status(401).json({ message: "No token found" });
  }
  try {
    const decoded = jwt.verify(
      oldToken,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload & { id: string; email: string; username: string };

    const { id, email, username } = decoded;
    const newToken = jwt.sign(
      { id, email, username },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
});

app.post(
  "/chat",
  isAuthenticated,
  async (req: express.Request & { user?: ReqUser }, res) => {
    try {
      const { query, thread_id } = req.body;
      const userId = req.user?.id;
      console.log("user", req.user?.id);

      if (!query.trim() || !thread_id) {
        return res.status(400).json({
          message: "Missing require field",
          success: false,
        });
      }

      const currentUser = await User.findById(userId).select("refreshToken");
      if (!currentUser) {
        return res.status(404).json({
          message: "User not Found",
          success: false,
        });
      }

      console.log("currentUser", currentUser);

      //decipher user refresh_token
      const decryptedRefreshToken = decrypt(currentUser.refreshToken, key);

      const credentials = {
        refresh_token: decryptedRefreshToken,
      };

      oauth2Client.setCredentials(credentials);

      const response = await calendarService(query, thread_id);

      await Session.findOneAndUpdate(
        { thread_id: thread_id },
        {
          $set: {userId: userId},
          $push: {
            messages: {
              $each: [
                { role: "human", content: query },
                { role: "ai", content: response?.data },
              ],
            },
          },
          
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({
        payload: response,
        success: true,
        message: "Query resolved successfully",
      });
    } catch (error) {
      console.error("error at chat endpoint", error);
      return res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  }
);

app.get("/session", isAuthenticated, async (req: express.Request & {user?: ReqUser}, res) => {
  try {
    const userId = req?.user?.id;
    console.log("userId while fetching session", userId)
    const response = await Session.find({userId}).limit(10).sort({ _id: -1 });
    console.log("session Response", response.length);
    return res.status(200).json({
      message: "session fetched successfully",
      payload: response.length > 0 ? response : [],
    });
  } catch (error) {
    console.error("error fetching sessions");
    return res.status(500).json({
      message: "error fetching sessios",
      payload: [],
    });
  }
});

app.get("/session/:thread_id", isAuthenticated, async (req: express.Request & {user?: ReqUser}, res) => {
  try {
    const { thread_id } = req.params;
    const userId = req?.user?.id;
    if (!thread_id) {
      return res.status(400).json({
        message: "Thread ID is required",
        success: false,
      });
    }
    const response = await Session.findOne({ thread_id,  userId}).select(
      "messages createdAt thread_id"
    );

    if (!response) {
      return res.status(404).json({
        message: "Session not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "fetched thread chat",
      success: true,
      payload: response,
    });
  } catch (error) {
    console.error("Error fetching session by thread_id:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

//verify if user is authenticated
app.get(
  "/me",
  isAuthenticated,
  (req: express.Request & { user?: ReqUser }, res) => {
   try {
     return res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: req.user,
    });
   } catch (error) {
       return res.status(500).json({
      success: false,
      message: "Something went wrong",
      
    });
   }
  }
);
const port = process.env.PORT || 3000

app.listen(port, () => {
  connectDB()
    .then(() => {
      initializeAgent();
      console.log(`Server is running on port ${port}`);
    })
    .catch((error) => {
      console.log("Error Running Server", error);
      process.exit(1);
    });
});
