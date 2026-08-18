import { Request, Response } from 'express';
import { db } from '../db';
import { settings, admins, refreshTokens } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_roma_film';

export class AdminController {
  static async handleAuth(req: Request, res: Response) {
    try {
      const { action, profile, currentPassword, newPassword } = req.body;
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      if (action === 'update-profile') {
        const currentProfile = await db.select().from(settings).where(eq(settings.key, 'adminProfile')).limit(1);
        const updatedProfile = { 
          ...(currentProfile.length > 0 ? (currentProfile[0].value as Record<string, any>) : {}), 
          ...profile 
        };

        await db.insert(settings).values({ key: 'adminProfile', value: updatedProfile })
          .onConflictDoUpdate({ target: settings.key, set: { value: updatedProfile, updatedAt: new Date() }});

        // Update the real admin login email if it was changed
        if (profile.email && profile.email !== user.email) {
          await db.update(admins).set({ email: profile.email }).where(eq(admins.id, user.id));
        }

        return res.json({ success: true, profile: updatedProfile });
      }

      if (action === 'update-password') {
        if (!currentPassword || !newPassword || newPassword.length < 6) {
          return res.status(400).json({ success: false, error: 'Current password and a valid new password (min 6 chars) are required' });
        }

        const adminRecord = await db.select().from(admins).where(eq(admins.id, user.id)).limit(1);
        if (adminRecord.length === 0) {
          return res.status(401).json({ success: false, error: 'Admin not found' });
        }

        const passwordMatch = await bcrypt.compare(currentPassword, adminRecord[0].passwordHash);
        if (!passwordMatch) {
          return res.status(401).json({ success: false, error: 'Incorrect current password' });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        await db.update(admins).set({ passwordHash: newPasswordHash }).where(eq(admins.id, user.id));

        return res.json({ success: true });
      }

      res.status(400).json({ success: false, error: 'Invalid action' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to process admin action' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password required' });
      }

      const adminRecord = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
      
      if (adminRecord.length === 0) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const admin = adminRecord[0];
      const passwordMatch = await bcrypt.compare(password, admin.passwordHash);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const accessToken = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '7d' });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      await db.insert(refreshTokens).values({
        token: refreshToken,
        adminId: admin.id,
        expiresAt,
      });

      res.cookie('roma_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000 // 15 mins
      });

      res.cookie('roma_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.json({ success: true, token: accessToken });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      // In the authenticateToken middleware, req.user is set
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const adminRecord = await db.select().from(admins).where(eq(admins.id, user.id)).limit(1);
      
      if (adminRecord.length === 0) {
        return res.status(401).json({ success: false, error: 'Admin not found' });
      }

      const currentProfile = await db.select().from(settings).where(eq(settings.key, 'adminProfile')).limit(1);
      const name = currentProfile.length > 0 ? (currentProfile[0].value as any).name : 'Admin';
      const avatar = currentProfile.length > 0 ? (currentProfile[0].value as any).avatar : null;

      return res.json({ 
        success: true, 
        user: { 
          email: adminRecord[0].email, 
          name,
          avatar
        } 
      });
    } catch (error) {
      console.error("getMe error:", error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.roma_refresh_token;

      if (refreshToken) {
        await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
      }

      res.clearCookie('roma_access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.clearCookie('roma_refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

      return res.json({ success: true });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
}
