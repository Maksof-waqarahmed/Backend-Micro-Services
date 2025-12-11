import { Request, Response } from "express";
import { userRegisterSchema, UserRegisterType } from "../types/user.types";
import { User } from "../models/user-model";
import { logger } from "../utils/logger";
import { generateTokens } from "../utils/generate-token";

// user register
export const userRegsiter = async (req: Request<{}, {}, UserRegisterType>, res: Response) => {
    logger.info("User register controller called");
    try {
        const parsed = userRegisterSchema.safeParse(req.body);

        if (!parsed.success) {
            logger.warn("User register controller called with invalid data", parsed.error.issues[0].message);
            return res.status(400).json({
                success: false,
                message: parsed.error.issues[0].message,
            });
        }

        const { email, name, password } = parsed.data;
        const user = await User.findOne({ email });
        if (user) {
            logger.warn("User already exists with this email!");
            return res.status(400).json({
                success: false,
                message: "User already exists with this email! Please try with different email"
            })
        }

        // await User.create({ userName: name, email, password })
        const newUser = new User({ userName: name, email, password });
        await newUser.save();
        logger.warn("User registered successfully", newUser._id)

        const payload = {
            email: newUser.email,
            userID: newUser._id,
            userName: newUser.userName
        }
        const { accessToken, refreshToken } = await generateTokens(payload);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            accessToken,
            refreshToken
        })
    } catch (error: any) {
        logger.warn("Registration error", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error" + error.message,
        })
    }
}