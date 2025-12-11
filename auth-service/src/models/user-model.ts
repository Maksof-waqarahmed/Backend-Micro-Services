import mongoose from "mongoose";
import bcrypt from 'bcrypt'

export type IUSER = {
    userName: string,
    email: string,
    password: string,
    createdAt: Date
}

const userSchema = new mongoose.Schema<IUSER>({
    email: { unique: true, required: true, type: String, trim: true, lowercase: true },
    password: { unique: true, required: true, type: String, trim: true },
    userName: { unique: true, required: true, type: String, trim: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true })

userSchema.pre('save', async function () {
    const user = this as any;
    if (!user.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    } catch (error) {
        throw error
    }
});

userSchema.methods.comparePassword = async function (userPassword: string) {
    try {
        return await bcrypt.compare(userPassword, this.password)
    } catch (error) {
        throw error
    }
}

userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model<IUSER>('User', userSchema);