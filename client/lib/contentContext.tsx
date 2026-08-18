"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  SiteContentData,
  INITIAL_SITE_CONTENT,
  AboutData,
  PhotoItem,
  VideoFilmItem,
  PackageItem,
  ServiceItem,
  InquiryItem,
  AdminProfile,
  ContactInfo,
  TestimonialItem,
} from "./initialData";

interface ContentContextType {
  content: SiteContentData;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  toastMessage: { text: string; type: "success" | "error" | "info" } | null;
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  updateAbout: (data: Partial<AboutData>) => void;
  updateContact: (data: Partial<ContactInfo>) => void;
  addPhoto: (photo: Omit<PhotoItem, "id">) => void;
  updatePhoto: (id: number, photo: Partial<PhotoItem>) => void;
  deletePhoto: (id: number) => void;
  addVideo: (video: Omit<VideoFilmItem, "id">) => void;
  updateVideo: (id: number, video: Partial<VideoFilmItem>) => void;
  deleteVideo: (id: number) => void;
  addPackage: (pkg: PackageItem) => void;
  updatePackage: (index: number, pkg: PackageItem) => void;
  deletePackage: (index: number) => void;
  addService: (service: ServiceItem) => void;
  updateService: (index: number, service: ServiceItem) => void;
  deleteService: (index: number) => void;
  addTestimonial: (testim: Omit<TestimonialItem, "id">) => void;
  updateTestimonial: (id: number, testim: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: number) => void;
  addInquiry: (inq: Partial<InquiryItem>) => Promise<boolean>;
  updateInquiryStatus: (id: string, status: InquiryItem["status"]) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  updateAdminProfile: (profile: Partial<AdminProfile>) => Promise<boolean>;
  saveToBackend: (customData?: SiteContentData) => Promise<boolean>;
  resetToDefaults: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "roma_film_site_content_v3";

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContentData>(INITIAL_SITE_CONTENT);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          setContent((prev) => ({
            ...prev,
            ...parsed,
            about: { ...INITIAL_SITE_CONTENT.about, ...(parsed.about || {}) },
            adminProfile: { ...INITIAL_SITE_CONTENT.adminProfile, ...(parsed.adminProfile || {}) },
            contact: { ...INITIAL_SITE_CONTENT.contact, ...(parsed.contact || {}) },
          }));
        }
      } catch {
        // ignore
      }
    }
  }, []);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = useCallback((text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Fetch initial content from API
  useEffect(() => {
    let active = true;

    // Fetch from backend API
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${API_URL}/api/content`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (active && json.success && json.data) {
          setContent(json.data);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data));
          } catch {
            // ignore
          }
        }
      })
      .catch((err) => {
        console.warn("Using local content state:", err);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Save to backend & sync localStorage
  const saveToBackend = useCallback(
    async (customData?: SiteContentData): Promise<boolean> => {
      const dataToSave = customData || content;
      setIsSaving(true);
      try {
        // Update local storage first
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        
        const res = await fetch(`${API_URL}/api/content`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(dataToSave),
        });
        const json = await res.json();
        if (json.success) {
          setHasUnsavedChanges(false);
          showToast("Changes saved & published to website successfully!", "success");
          return true;
        } else {
          showToast("Saved locally, server sync failed.", "info");
          return false;
        }
      } catch (err) {
        console.error("Save error:", err);
        showToast("Changes saved in browser session.", "info");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [content, showToast]
  );

  // Helper to update state and auto-sync
  const updateStateAndFlag = useCallback((updater: (prev: SiteContentData) => SiteContentData) => {
    setContent((prev) => {
      const next = updater(prev);
      setHasUnsavedChanges(true);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // ABOUT
  const updateAbout = useCallback(
    (data: Partial<AboutData>) => {
      updateStateAndFlag((prev) => ({
        ...prev,
        about: { ...prev.about, ...data },
      }));
    },
    [updateStateAndFlag]
  );

  // CONTACT
  const updateContact = useCallback(
    (data: Partial<ContactInfo>) => {
      updateStateAndFlag((prev) => ({
        ...prev,
        contact: { ...prev.contact, ...data },
      }));
    },
    [updateStateAndFlag]
  );

  // PHOTOS CRUD
  const addPhoto = useCallback(
    async (photo: Omit<PhotoItem, "id">) => {
      const nextId = content.photos.length > 0 ? Math.max(...content.photos.map((p) => p.id)) + 1 : 1;
      const newPhoto: PhotoItem = { id: nextId, ...photo };
      const next = { ...content, photos: [newPhoto, ...content.photos] };
      
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Photo added and saved to database!", "success");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  const updatePhoto = useCallback(
    async (id: number, photo: Partial<PhotoItem>) => {
      const next = {
        ...content,
        photos: content.photos.map((p) => (p.id === id ? { ...p, ...photo } : p)),
      };
      
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Photo updated in database!", "success");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  const deletePhoto = useCallback(
    async (id: number) => {
      const next = {
        ...content,
        photos: content.photos.filter((p) => p.id !== id),
      };
      
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Photo removed from database.", "info");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  // VIDEOS CRUD
  const addVideo = useCallback(
    async (video: Omit<VideoFilmItem, "id">) => {
      const nextId = content.videos.length > 0 ? Math.max(...content.videos.map((v) => v.id)) + 1 : 1;
      const newVideo: VideoFilmItem = { id: nextId, ...video };
      const next = { ...content, videos: [newVideo, ...content.videos] };
      
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Cinema film added to showcase and saved!", "success");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  const updateVideo = useCallback(
    async (id: number, video: Partial<VideoFilmItem>) => {
      const next = {
        ...content,
        videos: content.videos.map((v) => (v.id === id ? { ...v, ...video } : v)),
      };
      
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Cinema film updated successfully!", "success");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  const deleteVideo = useCallback(
    async (id: number) => {
      const next = {
        ...content,
        videos: content.videos.filter((v) => v.id !== id),
      };
      
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Film removed from showcase.", "info");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  // PACKAGES CRUD
  const addPackage = useCallback(
    async (pkg: PackageItem) => {
      const next = {
        ...content,
        packages: [...content.packages, pkg],
      };
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Package tier added and saved!", "success");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  const updatePackage = useCallback(
    async (index: number, pkg: PackageItem) => {
      const nextPackages = [...content.packages];
      nextPackages[index] = pkg;
      const next = { ...content, packages: nextPackages };
      
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Package tier updated and saved!", "success");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  const deletePackage = useCallback(
    async (index: number) => {
      const next = {
        ...content,
        packages: content.packages.filter((_, i) => i !== index),
      };
      
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Package tier removed from database.", "info");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  // SERVICES CRUD
  const addService = useCallback(
    async (service: ServiceItem) => {
      const next = {
        ...content,
        services: [...content.services, service],
      };
      
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Service added and saved!", "success");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  const updateService = useCallback(
    async (index: number, service: ServiceItem) => {
      const nextServices = [...content.services];
      nextServices[index] = service;
      const next = { ...content, services: nextServices };
      
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Service updated and saved!", "success");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  const deleteService = useCallback(
    async (index: number) => {
      const next = {
        ...content,
        services: content.services.filter((_, i) => i !== index),
      };
      
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Service removed from database.", "info");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  // TESTIMONIALS
  const addTestimonial = useCallback(
    async (testim: Omit<TestimonialItem, "id">) => {
      const nextId = content.testimonials.length > 0 
        ? Math.max(...content.testimonials.map((t) => t.id)) + 1 
        : 1;
      const next = {
        ...content,
        testimonials: [...content.testimonials, { ...testim, id: nextId }],
      };
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Testimonial added and saved!", "success");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  const updateTestimonial = useCallback(
    async (id: number, testim: Partial<TestimonialItem>) => {
      const next = {
        ...content,
        testimonials: content.testimonials.map((t) => (t.id === id ? { ...t, ...testim } : t)),
      };
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Testimonial updated and saved!", "success");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  const deleteTestimonial = useCallback(
    async (id: number) => {
      const next = {
        ...content,
        testimonials: content.testimonials.filter((t) => t.id !== id),
      };
      setContent(next);
      const success = await saveToBackend(next);
      if (success) showToast("Testimonial removed from database.", "info");
      return success;
    },
    [content, saveToBackend, showToast]
  );

  // INQUIRIES
  const addInquiry = useCallback(
    async (inq: Partial<InquiryItem>): Promise<boolean> => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${API_URL}/api/inquiries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inq),
        });
        const json = await res.json();
        if (json.success && json.inquiry) {
          setContent((prev) => ({
            ...prev,
            inquiries: [json.inquiry, ...prev.inquiries],
          }));
          return true;
        }
      } catch (e) {
        console.warn("Offline inquiry save:", e);
      }
      // Fallback local append
      const localInq: InquiryItem = {
        id: `inq-${Date.now()}`,
        name: inq.name || "Client",
        email: inq.email || "",
        phone: inq.phone || "",
        service: inq.service || "General Inquiry",
        weddingDate: inq.weddingDate || "",
        venue: inq.venue || "",
        budget: inq.budget || "$4,000 - $6,000",
        message: inq.message || "",
        status: "new",
        createdAt: new Date().toISOString(),
      };
      setContent((prev) => ({
        ...prev,
        inquiries: [localInq, ...prev.inquiries],
      }));
      return true;
    },
    []
  );

  const updateInquiryStatus = useCallback(
    async (id: string, status: InquiryItem["status"]) => {
      setContent((prev) => ({
        ...prev,
        inquiries: prev.inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq)),
      }));
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        await fetch(`${API_URL}/api/inquiries`, {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id, status }),
        });
      } catch {
        // ignore
      }
      showToast(`Inquiry marked as ${status.toUpperCase()}`, "success");
    },
    [showToast]
  );

  const deleteInquiry = useCallback(
    async (id: string) => {
      setContent((prev) => ({
        ...prev,
        inquiries: prev.inquiries.filter((inq) => inq.id !== id),
      }));
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        await fetch(`${API_URL}/api/inquiries?id=${id}`, { 
          method: "DELETE",
          credentials: "include"
        });
      } catch {
        // ignore
      }
      showToast("Inquiry deleted from inbox.", "info");
    },
    [showToast]
  );

  // ADMIN PROFILE
  const updateAdminProfile = useCallback(
    async (profile: Partial<AdminProfile>): Promise<boolean> => {
      updateStateAndFlag((prev) => ({
        ...prev,
        adminProfile: { ...prev.adminProfile, ...profile },
      }));
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        await fetch(`${API_URL}/api/admin/auth`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ action: "update-profile", profile }),
        });
      } catch {
        // ignore
      }
      showToast("Admin profile updated successfully!", "success");
      return true;
    },
    [updateStateAndFlag, showToast]
  );

  const resetToDefaults = useCallback(() => {
    setContent(INITIAL_SITE_CONTENT);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    saveToBackend(INITIAL_SITE_CONTENT);
    showToast("Reset all website content to studio defaults.", "info");
  }, [saveToBackend, showToast]);

  return (
    <ContentContext.Provider
      value={{
        content,
        isLoading,
        isSaving,
        hasUnsavedChanges,
        toastMessage,
        showToast,
        updateAbout,
        updateContact,
        addPhoto,
        updatePhoto,
        deletePhoto,
        addVideo,
        updateVideo,
        deleteVideo,
        addPackage,
        updatePackage,
        deletePackage,
        addService,
        updateService,
        deleteService,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        updateAdminProfile,
        saveToBackend,
        resetToDefaults,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none">
          <div
            className={`px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-3 text-sm font-medium ${
              toastMessage.type === "success"
                ? "bg-zinc-950/90 border-[#C19B6C]/40 text-[#F5F1E8]"
                : toastMessage.type === "error"
                ? "bg-red-950/90 border-red-500/40 text-red-100"
                : "bg-zinc-900/90 border-white/20 text-zinc-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                toastMessage.type === "success"
                  ? "bg-[#C19B6C] animate-ping"
                  : toastMessage.type === "error"
                  ? "bg-red-500"
                  : "bg-blue-400"
              }`}
            />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
