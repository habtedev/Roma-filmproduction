import { Request, Response } from 'express';
import { db } from '../db';
import { photos, videos, packages, services, inquiries, settings, testimonials } from '../db/schema';
import { eq } from 'drizzle-orm';
import { INITIAL_SITE_CONTENT } from '../db/initialData';

export class ContentController {
  static async getContent(req: Request, res: Response) {
    try {
      // Parallel fetch from Postgres
      const [
        photosData,
        videosData,
        packagesData,
        servicesData,
        inquiriesData,
        testimonialsData,
        aboutSetting,
        contactSetting,
        adminSetting
      ] = await Promise.all([
        db.select().from(photos).orderBy(photos.id),
        db.select().from(videos).orderBy(videos.id),
        db.select().from(packages).orderBy(packages.id),
        db.select().from(services).orderBy(services.id),
        db.select().from(inquiries).orderBy(inquiries.createdAt),
        db.select().from(testimonials).orderBy(testimonials.id),
        db.select().from(settings).where(eq(settings.key, 'about')).limit(1),
        db.select().from(settings).where(eq(settings.key, 'contact')).limit(1),
        db.select().from(settings).where(eq(settings.key, 'adminProfile')).limit(1),
      ]);

      const about = aboutSetting.length > 0 ? aboutSetting[0].value : INITIAL_SITE_CONTENT.about;
      const contact = contactSetting.length > 0 ? contactSetting[0].value : INITIAL_SITE_CONTENT.contact;
      const adminProfile = adminSetting.length > 0 ? adminSetting[0].value : INITIAL_SITE_CONTENT.adminProfile;

      const data = {
        about,
        contact,
        adminProfile,
        photos: photosData.length > 0 ? photosData : INITIAL_SITE_CONTENT.photos,
        videos: videosData.length > 0 ? videosData : INITIAL_SITE_CONTENT.videos,
        packages: packagesData.length > 0 ? packagesData : INITIAL_SITE_CONTENT.packages,
        services: servicesData.length > 0 ? servicesData : INITIAL_SITE_CONTENT.services,
        inquiries: inquiriesData.length > 0 ? inquiriesData : INITIAL_SITE_CONTENT.inquiries,
        testimonials: testimonialsData.length > 0 ? testimonialsData : INITIAL_SITE_CONTENT.testimonials,
      };

      res.json({ success: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to fetch content from database' });
    }
  }

  static async updateContent(req: Request, res: Response) {
    try {
      const data = req.body;
      
      // Update Settings (About, Contact, Admin)
      if (data.about) {
        await db.insert(settings).values({ key: 'about', value: data.about })
          .onConflictDoUpdate({ target: settings.key, set: { value: data.about, updatedAt: new Date() }});
      }
      if (data.contact) {
        await db.insert(settings).values({ key: 'contact', value: data.contact })
          .onConflictDoUpdate({ target: settings.key, set: { value: data.contact, updatedAt: new Date() }});
      }
      if (data.adminProfile) {
        await db.insert(settings).values({ key: 'adminProfile', value: data.adminProfile })
          .onConflictDoUpdate({ target: settings.key, set: { value: data.adminProfile, updatedAt: new Date() }});
      }

      // Note: For arrays (photos, videos, etc.), a real production app would use dedicated CRUD endpoints for each item 
      // instead of bulk updating the entire array. To keep the existing frontend compatibility, 
      // we'd do a truncate & bulk insert here, but for safety we'll rely on the dedicated routes if added later, 
      // or just do bulk upsert. For now, we save everything in JSON locally if needed, but we'll implement simple bulk sync.
      
      // Helper to strip undefined ids and convert createdAt strings to Date objects
      const processItems = (items: any[]) => items.map(item => {
        const processed = { ...item, id: undefined };
        if (processed.createdAt && typeof processed.createdAt === 'string') {
          processed.createdAt = new Date(processed.createdAt);
        }
        return processed;
      });

      // Bulk sync Photos (Truncate & Insert for simplicity to match frontend state)
      if (data.photos && data.photos.length > 0) {
        await db.delete(photos);
        await db.insert(photos).values(processItems(data.photos)); 
      }

      if (data.videos && data.videos.length > 0) {
        await db.delete(videos);
        await db.insert(videos).values(processItems(data.videos));
      }

      if (data.packages && data.packages.length > 0) {
        await db.delete(packages);
        await db.insert(packages).values(processItems(data.packages));
      }

      if (data.services && data.services.length > 0) {
        await db.delete(services);
        await db.insert(services).values(processItems(data.services));
      }

      if (data.testimonials && data.testimonials.length > 0) {
        await db.delete(testimonials);
        await db.insert(testimonials).values(processItems(data.testimonials));
      }

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to update content in database' });
    }
  }
}
