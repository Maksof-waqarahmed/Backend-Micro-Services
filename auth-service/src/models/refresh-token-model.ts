import { Schema, Types, model } from "mongoose";

export interface RefreshTokenModel {
    token: string;
    userId: Types.ObjectId;
    expiresAt: Date;
}

const refreshTokenSchema = new Schema<RefreshTokenModel>({
    token: { type: String, required: true, unique: true },
    userId: { type: Types.ObjectId, required: true, ref: "User" },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<RefreshTokenModel>("RefreshToken", refreshTokenSchema);