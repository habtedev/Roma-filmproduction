import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { refreshTokens } from '../db/schema';
import { eq, and, gt } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_roma_film';

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  let accessToken = req.cookies?.roma_access_token;
  const refreshToken = req.cookies?.roma_refresh_token;

  // Fallback to Authorization header if cookie is blocked/missing
  if (!accessToken && req.headers.authorization?.startsWith('Bearer ')) {
    accessToken = req.headers.authorization.split(' ')[1];
  }

  // Function to verify access token
  const verifyAccessToken = (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  };

  if (accessToken) {
    const user = verifyAccessToken(accessToken);
    if (user) {
      (req as any).user = user;
      return next();
    }
  }

  // Access token is missing or expired, try refresh token
  if (!refreshToken) {
    return res.status(401).json({ success: false, error: 'Access denied. No valid tokens provided.' });
  }

  try {
    // Verify refresh token signature
    const user: any = jwt.verify(refreshToken, JWT_SECRET);

    // Verify refresh token exists in DB and is not expired
    const tokenRecord = await db.select().from(refreshTokens).where(
      and(
        eq(refreshTokens.token, refreshToken),
        gt(refreshTokens.expiresAt, new Date())
      )
    ).limit(1);

    if (tokenRecord.length === 0) {
      return res.status(403).json({ success: false, error: 'Invalid or revoked refresh token.' });
    }

    // Generate new access token (e.g. 15 minutes)
    const newAccessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
    
    // Set new cookie
    res.cookie('roma_access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    (req as any).user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid or expired refresh token.' });
  }
}
