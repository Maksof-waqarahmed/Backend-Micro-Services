import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import RefreshToken from '../models/refresh-token-model';

export const generateTokens = async (user: { userName: string, email: string, userID: any }) => {
    const accessToken = jwt.sign({
        data: user
    }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + 7) // refresh token expires in 7 days

    await RefreshToken.create({ token: refreshToken, userId: user.userID, expiresAt: expireAt });
    return { accessToken, refreshToken }
}