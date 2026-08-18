import { Request, Response } from 'express';
import { db } from '../db';
import { inquiries } from '../db/schema';
import { eq } from 'drizzle-orm';
import { InquiryItem } from '../types/SiteContent';

export class InquiryController {
  static async addInquiry(req: Request, res: Response) {
    try {
      const inqData = req.body;
      
      const newInquiry = {
        id: `inq-${Date.now()}`,
        name: inqData.name || "Client",
        partnerName: inqData.partnerName || "",
        email: inqData.email || "",
        phone: inqData.phone || "",
        service: inqData.service || "General Inquiry",
        weddingDate: inqData.weddingDate || "",
        venue: inqData.venue || "",
        budget: inqData.budget || "$4,000 - $6,000",
        message: inqData.message || "",
        howFound: inqData.howFound || "",
        status: "new",
      };

      await db.insert(inquiries).values(newInquiry);
      res.json({ success: true, inquiry: newInquiry });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to add inquiry to database' });
    }
  }

  static async updateInquiryStatus(req: Request, res: Response) {
    try {
      const { id, status } = req.body;
      
      await db.update(inquiries)
        .set({ status })
        .where(eq(inquiries.id, id));
      
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to update inquiry status' });
    }
  }

  static async deleteInquiry(req: Request, res: Response) {
    try {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'Missing inquiry ID' });
      }

      await db.delete(inquiries).where(eq(inquiries.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to delete inquiry' });
    }
  }
}
