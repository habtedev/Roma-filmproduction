"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Image as ImageIcon,
  Film,
  Package,
  Layers,
  Inbox,
  Lock,
  Save,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Check,
  AlertCircle,
  Eye,
  Key,
  Mail,
  Phone,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Camera,
  Search,
  CheckCircle2,
  MapPin,
  Clock,
  ChevronRight,
  UploadCloud,
  Loader2,
  Heart,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useContent } from "@/lib/contentContext";
import {
  PhotoItem,
  VideoFilmItem,
  PackageItem,
  ServiceItem,
  InquiryItem,
  TestimonialItem,
} from "@/lib/initialData";

type AdminTab =
  | "dashboard"
  | "profile"
  | "about"
  | "photos"
  | "videos"
  | "packages"
  | "services"
  | "testimonials";

const PHOTO_PRESETS = [
  "/image/wedding_sunset.webp",
  "/image/bride_portrait.webp",
  "/image/couple_romantic.webp",
  "/image/wedding_details.webp",
  "/image/about_portrait.webp",
  "/image/video_thumb_1.webp",
  "/image/video_thumb_2.webp",
];

const authFetch = (url: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("roma_token") : null;
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, { ...options, headers });
};

export default function AdminPage() {
  const router = useRouter();
  const {
    content,
    updateAbout,
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
    updateAdminProfile,
    saveToBackend,
    showToast,
  } = useContent();

  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search & Filters
  const [photoSearch, setPhotoSearch] = useState("");
  const [photoCategory, setPhotoCategory] = useState("All");

  // Photo Edit / Add State
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingAboutPhoto, setIsUploadingAboutPhoto] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [photoForm, setPhotoForm] = useState<Omit<PhotoItem, "id">>({
    title: "",
    category: "Weddings",
    location: "Dallas, TX",
    src: "/image/wedding_sunset.webp",
    specs: "Leica SL2 · 35mm f/1.4",
    featured: false,
  });

  // Video Edit / Add State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isUploadingVideoPoster, setIsUploadingVideoPoster] = useState(false);
  const [isUploadingVideoFile, setIsUploadingVideoFile] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoFilmItem | null>(null);
  const [videoForm, setVideoForm] = useState<Omit<VideoFilmItem, "id">>({
    title: "",
    type: "Cinematic Highlight Film",
    location: "Dallas Estate, Texas",
    duration: "5:00",
    tag: "Highlight Film",
    poster: "/image/video_thumb_1.webp",
    videoUrl: "/videos/banner.mp4",
    quote: "A masterpiece film of our wedding day.",
    couple: "",
  });

  // Package Edit / Add State
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackageIndex, setEditingPackageIndex] = useState<number | null>(null);
  const [packageForm, setPackageForm] = useState<PackageItem>({
    title: "",
    subtitle: "",
    price: "$3,500",
    features: ["8 Hours Coverage", "Lead Photographer", "High-Resolution Gallery"],
    recommended: false,
    cta: "Select Package",
    popular: false,
  });
  const [packageFeatureInput, setPackageFeatureInput] = useState("");

  // Service Edit / Add State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isUploadingServiceImage, setIsUploadingServiceImage] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceItem>({
    category: "Wedding Cinema & Photo",
    title: "",
    desc: "",
    features: ["Full Day Coverage", "4K Video"],
    tag: "Featured",
    image: "/image/bride_portrait.webp",
  });
  const [serviceFeatureInput, setServiceFeatureInput] = useState("");

  // Testimonials Edit / Add State
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  // Authenticated User State
  const [authUser, setAuthUser] = useState<{ email: string; name: string; avatar: string | null } | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

        const res = await authFetch(`${API_URL}/api/auth/me?_t=${Date.now()}`, {
          credentials: "include",
          cache: "no-store"
        });
        const data = await res.json();
        if (data.success && data.user) {
          console.log("fetchUser success! User:", data.user);
          setAuthUser(data.user);
          // Sync profile form email with real authenticated email
          setProfileForm(prev => ({ ...prev, email: data.user.email }));
        } else {
          console.error("fetchUser rejected session. Server returned:", data);
          router.push("/admin/login");
        }
      } catch (err) {
        console.error("Failed to fetch user completely:", err);
        router.push("/admin/login");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      await authFetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
      localStorage.removeItem("roma_token");
    } catch (err) {
      console.error("Logout error:", err);
    }
    router.push("/admin/login");
  };

  const [isUploadingTestimonialImage, setIsUploadingTestimonialImage] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<Omit<TestimonialItem, "id">>({
    name: "",
    venue: "",
    location: "",
    date: "",
    quote: "",
    message: "",
    image: "/image/bride_portrait.webp",
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState(content.adminProfile);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const prevAdminRef = React.useRef(content.adminProfile);

  // Update profile form when content loads from API
  React.useEffect(() => {
    if (content.adminProfile && content.adminProfile !== prevAdminRef.current) {
      prevAdminRef.current = content.adminProfile;
      const timer = setTimeout(() => {
        setProfileForm(content.adminProfile);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [content.adminProfile]);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return content.photos.filter((p) => {
      const matchCat = photoCategory === "All" || p.category === photoCategory;
      const matchSearch =
        p.title.toLowerCase().includes(photoSearch.toLowerCase()) ||
        p.location.toLowerCase().includes(photoSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [content.photos, photoCategory, photoSearch]);

  const handleSavePhoto = async () => {
    if (!photoForm.title || !photoForm.src) {
      showToast("Please enter a title and image source", "error");
      return;
    }

    // Show a saving state? We can just await it since saveToBackend sets isSaving=true internally
    if (editingPhoto) {
      await updatePhoto(editingPhoto.id, photoForm);
    } else {
      await addPhoto(photoForm);
    }

    setIsPhotoModalOpen(false);
    setEditingPhoto(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await authFetch(`${API_URL}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setPhotoForm({ ...photoForm, src: data.url });
        showToast("Photo uploaded successfully!", "success");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.warn("Upload Error Caught:", error);
      showToast("Failed to upload photo", "error");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await authFetch(`${API_URL}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setProfileForm({ ...profileForm, avatar: data.url });
        showToast("Avatar uploaded successfully!", "success");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.warn("Upload Error Caught:", error);
      showToast("Failed to upload avatar", "error");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAboutPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAboutPhoto(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await authFetch(`${API_URL}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        updateAbout({ artistImage: data.url });
        const nextContent = {
          ...content,
          about: { ...content.about, artistImage: data.url }
        };
        await saveToBackend(nextContent);
        showToast("Artist portrait uploaded and saved to database!", "success");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.warn("Upload Error Caught:", error);
      showToast("Failed to upload artist portrait", "error");
    } finally {
      setIsUploadingAboutPhoto(false);
    }
  };

  const handleVideoPosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideoPoster(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await authFetch(`${API_URL}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setVideoForm({ ...videoForm, poster: data.url });
        showToast("Poster thumbnail uploaded successfully!", "success");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.warn("Upload Error Caught:", error);
      showToast("Failed to upload poster", "error");
    } finally {
      setIsUploadingVideoPoster(false);
    }
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideoFile(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await authFetch(`${API_URL}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setVideoForm({ ...videoForm, videoUrl: data.url });
        showToast("Video stream uploaded successfully!", "success");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.warn("Upload Error Caught:", error);
      showToast("Failed to upload video stream", "error");
    } finally {
      setIsUploadingVideoFile(false);
    }
  };

  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingServiceImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await authFetch(`${API_URL}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setServiceForm({ ...serviceForm, image: data.url });
        showToast("Service cover uploaded successfully!", "success");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.warn("Upload Error Caught:", error);
      showToast("Failed to upload service cover", "error");
    } finally {
      setIsUploadingServiceImage(false);
    }
  };

  // Handle Video Save
  const handleSaveVideo = () => {
    if (!videoForm.title || !videoForm.poster) {
      showToast("Please enter a title and poster image", "error");
      return;
    }
    if (editingVideo) {
      updateVideo(editingVideo.id, videoForm);
    } else {
      addVideo(videoForm);
    }
    setIsVideoModalOpen(false);
    setEditingVideo(null);
  };

  // Handle Package Save
  const handleSavePackage = () => {
    if (!packageForm.title || !packageForm.price) {
      showToast("Please provide package title and price", "error");
      return;
    }
    if (editingPackageIndex !== null) {
      updatePackage(editingPackageIndex, packageForm);
    } else {
      addPackage(packageForm);
    }
    setIsPackageModalOpen(false);
    setEditingPackageIndex(null);
  };

  // Handle Service Save
  const handleSaveService = () => {
    if (!serviceForm.title || !serviceForm.desc) {
      showToast("Please provide service title and description", "error");
      return;
    }
    if (editingServiceIndex !== null) {
      updateService(editingServiceIndex, serviceForm);
    } else {
      addService(serviceForm);
    }
    setIsServiceModalOpen(false);
    setEditingServiceIndex(null);
  };

  // Handle Testimonial Save
  const handleSaveTestimonial = () => {
    if (!testimonialForm.name || !testimonialForm.quote || !testimonialForm.message) {
      showToast("Please provide the couple's name, quote, and full review message.", "error");
      return;
    }
    if (editingTestimonialId !== null) {
      updateTestimonial(editingTestimonialId, testimonialForm);
    } else {
      addTestimonial(testimonialForm);
    }
    setIsTestimonialModalOpen(false);
    setEditingTestimonialId(null);
  };

  const handleTestimonialFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingTestimonialImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await authFetch(`${API_URL}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        setTestimonialForm({ ...testimonialForm, image: json.url });
        showToast("Image uploaded successfully!", "success");
      } else {
        showToast("Failed to upload image", "error");
      }
    } catch (err) {
      console.warn("Upload error:", err);
      showToast("Error uploading image", "error");
    } finally {
      setIsUploadingTestimonialImage(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      setPasswordStatus("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus("Passwords do not match");
      return;
    }
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await authFetch(`${API_URL}/api/admin/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          action: "update-password",
          currentPassword: passwordForm.current,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Admin password updated successfully!", "success");
        setPasswordForm({ current: "", newPassword: "", confirmPassword: "" });
        setPasswordStatus(null);
      } else {
        setPasswordStatus(data.error || "Password update failed");
      }
    } catch {
      setPasswordStatus("Error updating password");
    }
  };

  // Handle Profile Save
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile(profileForm);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E0E12] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl border border-[#C19B6C]/30 bg-[#14141A] p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#C19B6C]/20 border border-[#C19B6C]/40 flex items-center justify-center mx-auto text-[#C19B6C]">
            <Lock size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-display font-medium text-white tracking-wide">Studio Admin Portal</h2>
            <p className="text-sm text-zinc-400 mt-2 font-light">Sign in to manage website production assets</p>
          </div>
          <div className="space-y-4 text-left">
            <div>
              <label className="text-xs font-mono uppercase text-zinc-400">Admin Email</label>
              <input
                type="email"
                defaultValue={content.adminProfile.email}
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-[#1a1a24]/50 border border-white/[0.08] text-white text-sm focus:border-[#C19B6C]/50 focus:ring-1 focus:ring-[#C19B6C]/50 focus:outline-none transition-all shadow-inner hover:bg-[#1a1a24]/80"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase text-zinc-400">Password</label>
              <input
                type="password"
                defaultValue="password123"
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-[#1a1a24]/50 border border-white/[0.08] text-white text-sm focus:border-[#C19B6C]/50 focus:ring-1 focus:ring-[#C19B6C]/50 focus:outline-none transition-all shadow-inner hover:bg-[#1a1a24]/80"
              />
            </div>
            <button
              onClick={() => setIsAuthenticated(true)}
              className="w-full py-3 rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 font-bold text-sm uppercase tracking-wider transition-all"
            >
              Sign In to Admin CMS
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0d] text-[#F5F1E8] flex flex-col pt-0">
      {/* ── Top Header Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-[#0c0c0f]/80 backdrop-blur-2xl border-b border-white/[0.05] shadow-2xl px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-xl hover:bg-white/5 text-zinc-400 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="hidden sm:flex w-8 h-8 rounded-lg bg-[#C19B6C]/20 border border-[#C19B6C]/40 items-center justify-center text-[#C19B6C]">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#C19B6C] uppercase tracking-widest font-semibold">
                Studio Studio CMS
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Sync Active
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-medium text-white tracking-wide capitalize font-display mt-0.5">
              {activeTab === "dashboard"
                ? "Production Overview & Analytics"
                : activeTab === "profile"
                  ? "Admin Profile & Security"
                  : `${activeTab} Management & Studio Editor`}
            </h1>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2.5">

          <Link
            href="/"
            target="_blank"
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 transition-colors flex items-center gap-1.5"
          >
            <span>View Website</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </header>

      {/* ── Main Layout: Sidebar + Content Canvas ── */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* ── Sidebar Navigation ── */}
        <aside className={`fixed inset-y-0 left-0 w-[280px] md:relative md:w-64 lg:w-72 bg-[#0c0c0f]/95 border-r border-white/[0.05] shadow-[4px_0_24px_rgba(0,0,0,0.5)] p-4 space-y-6 shrink-0 z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <div>
            {/* Mobile Close Button */}
            <div className="flex items-center justify-between mb-6 md:hidden">
              <span className="text-xs font-mono text-[#C19B6C] uppercase tracking-widest font-semibold">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 rounded-xl hover:bg-white/5 text-zinc-400">
                <X size={20} />
              </button>
            </div>

            {/* Admin User Card in Sidebar */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl overflow-hidden relative border border-[#C19B6C]/40 shrink-0 bg-black/20 flex items-center justify-center">
                {authUser?.avatar || content.adminProfile.avatar ? (
                  <Image
                    src={authUser?.avatar || content.adminProfile.avatar || "/image/about_portrait.webp"}
                    alt="Admin Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User size={20} className="text-[#C19B6C]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-white truncate">{authUser ? authUser.name : content.adminProfile.name}</h4>
                <p className="text-[11px] text-[#C19B6C] font-mono truncate">{authUser ? authUser.email : content.adminProfile.email}</p>
                <span className="text-[9px] text-zinc-400 block truncate mt-0.5">Admin Portal</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
                { id: "profile", label: "Admin & Password", icon: User },
                { id: "about", label: "About Page & Story", icon: Edit3 },
                { id: "photos", label: "Photo Portfolio", icon: ImageIcon, count: content.photos.length },
                { id: "videos", label: "Cinema & Films", icon: Film, count: content.videos.length },
                { id: "packages", label: "Packages & Pricing", icon: Package, count: content.packages.length },
                { id: "services", label: "Services & Offerings", icon: Layers, count: content.services.length },
                { id: "testimonials", label: "Love Stories & Praise", icon: Heart, count: content.testimonials?.length || 0 },
              ].map((tab: any) => {
                const active = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as AdminTab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer ${active
                      ? "bg-gradient-to-r from-[#C19B6C]/90 to-[#C19B6C] text-zinc-950 font-bold shadow-lg shadow-[#C19B6C]/20 scale-[1.02]"
                      : "text-zinc-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={active ? "text-zinc-950" : "text-[#C19B6C]"} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${active
                          ? "bg-zinc-950/20 text-zinc-950"
                          : tab.highlight
                            ? "bg-[#C19B6C] text-zinc-950"
                            : "bg-white/10 text-zinc-300"
                          }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer mt-4"
          >
            <LogOut size={16} />
            <span>Secure Logout</span>
          </button>
        </aside>

        {/* ── Main Content Area ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
          {/* ======================================================== */}
          {/* TAB: DASHBOARD OVERVIEW                                  */}
          {/* ======================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Quick Stat Highlights */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Portfolio Photos",
                    val: content.photos.length,
                    icon: Camera,
                    color: "text-amber-400",
                    tab: "photos",
                  },
                  {
                    label: "Cinema Films",
                    val: content.videos.length,
                    icon: Film,
                    color: "text-[#C19B6C]",
                    tab: "videos",
                  },
                  {
                    label: "Pricing Packages",
                    val: content.packages.length,
                    icon: Package,
                    color: "text-blue-400",
                    tab: "packages",
                  },
                  {
                    label: "Services & Offerings",
                    val: content.services.length,
                    icon: Layers,
                    color: "text-purple-400",
                    tab: "services",
                  },
                  {
                    label: "Client Love Stories",
                    val: content.testimonials?.length || 0,
                    icon: Heart,
                    color: "text-rose-400",
                    tab: "testimonials",
                  },
                ].map((stat: any, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveTab(stat.tab as AdminTab)}
                      className="p-5 rounded-2xl bg-[#121217]/50 backdrop-blur-xl border border-white/[0.08] hover:border-[#C19B6C]/50 hover:bg-[#1a1a24]/80 transition-all duration-300 cursor-pointer group space-y-2 shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#C19B6C]/10"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                          {stat.label}
                        </span>
                        <Icon size={18} className={stat.color} />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white font-mono">{stat.val}</h3>
                        {stat.sub && (
                          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {stat.sub}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 group-hover:text-[#C19B6C] flex items-center gap-1 transition-colors">
                        <span>Manage section</span>
                        <ChevronRight size={12} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Jump Editor Banners */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveTab("about")}
                  className="p-5 rounded-2xl bg-gradient-to-br from-[#1b1915]/80 to-[#121217]/80 backdrop-blur-xl border border-[#C19B6C]/20 hover:border-[#C19B6C]/60 hover:shadow-[0_0_20px_rgba(193,155,108,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <Edit3 className="text-[#C19B6C] mb-2" size={20} />
                  <h4 className="text-sm font-semibold text-white">Edit About &amp; Story</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Update studio philosophy, founder portrait, and stats counters.
                  </p>
                </div>
                <div
                  onClick={() => setActiveTab("photos")}
                  className="p-5 rounded-2xl bg-gradient-to-br from-[#12151d]/80 to-[#121217]/80 backdrop-blur-xl border border-blue-500/20 hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <Camera className="text-blue-400 mb-2" size={20} />
                  <h4 className="text-sm font-semibold text-white">Manage Photo Gallery</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Add, edit, and organize editorial photo shoots and featured tags.
                  </p>
                </div>
                <div
                  onClick={() => setActiveTab("videos")}
                  className="p-5 rounded-2xl bg-gradient-to-br from-[#1d1217]/80 to-[#121217]/80 backdrop-blur-xl border border-red-500/20 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <Film className="text-red-400 mb-2" size={20} />
                  <h4 className="text-sm font-semibold text-white">Manage Cinema Films</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Update highlight teasers, drone showcase, and client review quotes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: ADMIN PROFILE & SECURITY                            */}
          {/* ======================================================== */}
          {activeTab === "profile" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-medium text-white tracking-wide font-display">Admin Profile &amp; Studio Security</h2>
                <p className="text-xs text-zinc-400 mt-1 font-light tracking-wide">
                  Manage your admin credentials, login email, security passwords, and studio presence.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Details Form */}
                <form
                  onSubmit={handleProfileSubmit}
                  className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4 shadow-xl"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <User className="text-[#C19B6C]" size={20} />
                    <h3 className="text-base font-semibold text-white">Account Details</h3>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-3 w-full md:w-1/3">
                      <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#C19B6C]/30 bg-[#1a1a24] shadow-xl group">
                        {profileForm.avatar ? (
                          <img src={profileForm.avatar} alt="Admin Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            <User size={40} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <UploadCloud size={24} className="text-white" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleAvatarUpload}
                          disabled={isUploadingAvatar}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                          Profile Avatar
                        </p>
                        {isUploadingAvatar && <p className="text-xs text-[#C19B6C] animate-pulse">Uploading...</p>}
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 space-y-4 w-full">
                      <div>
                        <label className="text-xs font-mono uppercase text-zinc-400">Admin Full Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#1a1a24]/50 border border-white/[0.08] text-white text-sm focus:border-[#C19B6C]/50 focus:ring-1 focus:ring-[#C19B6C]/50 focus:outline-none transition-all shadow-inner hover:bg-[#1a1a24]/80"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono uppercase text-zinc-400">Admin Email Address</label>
                        <div className="relative mt-1">
                          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a24]/50 border border-white/[0.08] text-white text-sm focus:border-[#C19B6C]/50 focus:ring-1 focus:ring-[#C19B6C]/50 focus:outline-none transition-all shadow-inner hover:bg-[#1a1a24]/80"
                          />
                        </div>
                        <span className="text-[10px] text-zinc-500 mt-1 block">Primary login and notification inbox.</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>Save Profile Changes</span>
                  </button>
                </form>

                {/* Password & Security Card */}
                <div className="space-y-6">
                  <form
                    onSubmit={handlePasswordSubmit}
                    className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4 shadow-xl"
                  >
                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                      <Key className="text-[#C19B6C]" size={20} />
                      <h3 className="text-base font-semibold text-white">Change Admin Password</h3>
                    </div>

                    {passwordStatus && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                        <AlertCircle size={14} />
                        <span>{passwordStatus}</span>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-mono uppercase text-zinc-400">Current Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#1a1a24]/50 border border-white/[0.08] text-white text-sm focus:border-[#C19B6C]/50 focus:ring-1 focus:ring-[#C19B6C]/50 focus:outline-none transition-all shadow-inner hover:bg-[#1a1a24]/80"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-zinc-400">New Password</label>
                      <input
                        type="password"
                        placeholder="At least 6 characters"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#1a1a24]/50 border border-white/[0.08] text-white text-sm focus:border-[#C19B6C]/50 focus:ring-1 focus:ring-[#C19B6C]/50 focus:outline-none transition-all shadow-inner hover:bg-[#1a1a24]/80"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-zinc-400">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Re-enter new password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                        }
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[#1a1a24]/50 border border-white/[0.08] text-white text-sm focus:border-[#C19B6C]/50 focus:ring-1 focus:ring-[#C19B6C]/50 focus:outline-none transition-all shadow-inner hover:bg-[#1a1a24]/80"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                    >
                      <Lock size={14} />
                      <span>Update Password</span>
                    </button>
                  </form>

                  {/* Security Session Info */}
                  <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-3">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-emerald-400" size={20} />
                      <h4 className="text-sm font-semibold text-white">Security &amp; Device Sessions</h4>
                    </div>
                    <div className="space-y-2 text-xs text-zinc-400">
                      <p className="flex items-center justify-between">
                        <span>Last Session Login:</span>
                        <span className="text-zinc-200 font-mono">{content.adminProfile.lastLogin}</span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span>Two-Factor Authentication:</span>
                        <span className="text-emerald-400 font-semibold">Enabled</span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span>API Data Persistence:</span>
                        <span className="text-[#C19B6C] font-mono">Node.js JSON Store</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: ABOUT PAGE & STORY EDITOR                           */}
          {/* ======================================================== */}
          {activeTab === "about" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">About Page &amp; Artist Story Editor</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Edit biography text, founder portrait image, artist quote, and milestone counters.
                  </p>
                </div>
                <button
                  onClick={() => saveToBackend()}
                  className="px-4 py-2 rounded-xl bg-[#C19B6C] text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Save size={13} />
                  <span>Apply to Live Site</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Headline & Eyebrow */}
                  <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
                    <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">
                      Header &amp; Subheadings
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono uppercase text-zinc-400">Eyebrow Badge</label>
                        <input
                          type="text"
                          value={content.about.eyebrow}
                          onChange={(e) => updateAbout({ eyebrow: e.target.value })}
                          className="w-full mt-1 px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono uppercase text-zinc-400">Press Badge Text</label>
                        <input
                          type="text"
                          value={content.about.badgeText}
                          onChange={(e) => updateAbout({ badgeText: e.target.value })}
                          className="w-full mt-1 px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase text-zinc-400">Main Heading</label>
                      <input
                        type="text"
                        value={content.about.heading}
                        onChange={(e) => updateAbout({ heading: e.target.value })}
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase text-zinc-400">Subheading Tagline</label>
                      <input
                        type="text"
                        value={content.about.subheading}
                        onChange={(e) => updateAbout({ subheading: e.target.value })}
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Story Paragraphs */}
                  <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
                    <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">
                      Story &amp; Narrative Body
                    </h3>
                    <div>
                      <label className="text-xs font-mono uppercase text-zinc-400">Lead Paragraph</label>
                      <textarea
                        rows={3}
                        value={content.about.leadParagraph}
                        onChange={(e) => updateAbout({ leadParagraph: e.target.value })}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm resize-y"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase text-zinc-400">Secondary Paragraph</label>
                      <textarea
                        rows={3}
                        value={content.about.secondaryParagraph}
                        onChange={(e) => updateAbout({ secondaryParagraph: e.target.value })}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm resize-y"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase text-zinc-400">Artist Philosophy Quote</label>
                      <textarea
                        rows={2}
                        value={content.about.quote}
                        onChange={(e) => updateAbout({ quote: e.target.value })}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm resize-y"
                      />
                    </div>
                  </div>

                  {/* Stats Counters */}
                  <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
                    <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">
                      Milestone Numbers &amp; Counters
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Experience</label>
                        <input
                          type="text"
                          value={content.about.experienceYears}
                          onChange={(e) => updateAbout({ experienceYears: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Weddings Shot</label>
                        <input
                          type="text"
                          value={content.about.weddingsCount}
                          onChange={(e) => updateAbout({ weddingsCount: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Countries</label>
                        <input
                          type="text"
                          value={content.about.countriesCount}
                          onChange={(e) => updateAbout({ countriesCount: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Satisfaction</label>
                        <input
                          type="text"
                          value={content.about.satisfactionRate}
                          onChange={(e) => updateAbout({ satisfactionRate: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Artist Portrait & Live Preview Card */}
                <div className="space-y-6">
                  {/* Artist Photo Selector */}
                  <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
                    <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">
                      Artist Portrait &amp; Identity
                    </h3>

                    <div className="space-y-3">
                      <label className="text-xs font-mono uppercase text-zinc-400">Artist Portrait Image</label>
                      <div className="relative w-full aspect-[4/5] rounded-xl border-2 border-dashed border-white/10 bg-black/30 overflow-hidden flex flex-col items-center justify-center group transition-colors hover:border-[#C19B6C]/50">
                        {content.about.artistImage ? (
                          <>
                            <Image src={content.about.artistImage} alt="Artist Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                              <label className="cursor-pointer flex flex-col items-center gap-2">
                                <div className="p-3 bg-[#C19B6C] rounded-full text-zinc-950">
                                  <UploadCloud size={20} />
                                </div>
                                <span className="text-xs font-mono uppercase tracking-widest font-semibold text-white">Replace Portrait</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleAboutPhotoUpload} disabled={isUploadingAboutPhoto} />
                              </label>
                            </div>
                          </>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center gap-3 p-6 text-center w-full h-full justify-center">
                            {isUploadingAboutPhoto ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C19B6C]" />
                            ) : (
                              <div className="p-4 bg-white/5 rounded-full text-zinc-400 group-hover:text-[#C19B6C] group-hover:bg-[#C19B6C]/10 transition-colors">
                                <UploadCloud size={24} />
                              </div>
                            )}
                            <div>
                              <span className="text-xs font-mono uppercase tracking-widest font-semibold block mb-1">Upload New Portrait</span>
                              <span className="text-[10px] text-zinc-500">Click to browse or drag &amp; drop</span>
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={handleAboutPhotoUpload} disabled={isUploadingAboutPhoto} />
                          </label>
                        )}
                        {isUploadingAboutPhoto && content.about.artistImage && (
                          <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-3">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C19B6C]" />
                              <span className="text-xs font-mono uppercase tracking-widest font-semibold text-[#C19B6C]">Uploading...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-zinc-400">Artist Name</label>
                      <input
                        type="text"
                        value={content.about.artistName}
                        onChange={(e) => updateAbout({ artistName: e.target.value })}
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-zinc-400">Artist Title</label>
                      <input
                        type="text"
                        value={content.about.artistRole}
                        onChange={(e) => updateAbout({ artistRole: e.target.value })}
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: PHOTOS GALLERY (FULL CRUD)                          */}
          {/* ======================================================== */}
          {activeTab === "photos" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Header & Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Photo Portfolio Manager</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Add, edit, reorder, and remove fine art photographs from the website gallery.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingPhoto(null);
                    setPhotoForm({
                      title: "",
                      category: "Weddings",
                      location: "Dallas, TX",
                      src: "/image/wedding_sunset.webp",
                      specs: "Leica SL2 · 35mm f/1.4",
                      featured: false,
                    });
                    setIsPhotoModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Add New Photo</span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#121217] p-3 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Search size={14} className="text-zinc-500 ml-2" />
                  <input
                    type="text"
                    placeholder="Search photos by title or location..."
                    value={photoSearch}
                    onChange={(e) => setPhotoSearch(e.target.value)}
                    className="bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none w-full sm:w-64"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  {["All", "Weddings", "Bride & Groom", "Couples", "Details & Styling", "Engagement"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPhotoCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${photoCategory === cat
                        ? "bg-[#C19B6C] text-zinc-950 font-bold"
                        : "bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-2xl bg-[#121217] border border-white/10 overflow-hidden group hover:border-[#C19B6C]/50 transition-all flex flex-col shadow-lg"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-[4/3] relative w-full overflow-hidden bg-zinc-900">
                      <Image
                        src={photo.src}
                        alt={photo.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-[#C19B6C] border border-[#C19B6C]/30">
                        {photo.category}
                      </div>
                      {photo.featured && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#C19B6C] text-zinc-950 text-[9px] font-bold uppercase tracking-wider">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="text-xs font-semibold text-white line-clamp-1">{photo.title}</h4>
                        <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-[#C19B6C]" />
                          <span>{photo.location}</span>
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-1 line-clamp-1">{photo.specs}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            setEditingPhoto(photo);
                            setPhotoForm({
                              title: photo.title,
                              category: photo.category,
                              location: photo.location,
                              src: photo.src,
                              specs: photo.specs,
                              featured: !!photo.featured,
                            });
                            setIsPhotoModalOpen(true);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-zinc-300 font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deletePhoto(photo.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: CINEMA & VIDEOS (FULL CRUD)                         */}
          {/* ======================================================== */}
          {activeTab === "videos" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Cinema &amp; Films Production Manager</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage wedding highlight trailers, feature films, client quotes, and video stream links.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingVideo(null);
                    setVideoForm({
                      title: "",
                      type: "Cinematic Highlight Film",
                      location: "Dallas Estate, Texas",
                      duration: "5:00",
                      tag: "Highlight Film",
                      poster: "/image/video_thumb_1.webp",
                      videoUrl: "/videos/banner.mp4",
                      quote: "A timeless masterpiece.",
                      couple: "",
                    });
                    setIsVideoModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Add New Film</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.videos.map((video) => (
                  <div
                    key={video.id}
                    className="rounded-3xl bg-[#121217] border border-white/10 overflow-hidden shadow-xl hover:border-[#C19B6C]/40 transition-all flex flex-col justify-between"
                  >
                    {/* Video Poster with overlay */}
                    <div className="aspect-video relative w-full bg-zinc-900">
                      <Image src={video.poster} alt={video.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 border border-[#C19B6C]/40 text-[10px] font-mono font-semibold text-[#C19B6C]">
                        {video.tag}
                      </div>
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 text-[10px] font-mono text-zinc-300 flex items-center gap-1">
                        <Clock size={11} />
                        <span>{video.duration}</span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-[10px] font-mono uppercase text-[#C19B6C] block">
                          {video.location}
                        </span>
                        <h4 className="text-base font-semibold text-white">{video.title}</h4>
                      </div>
                    </div>

                    {/* Film Details */}
                    <div className="p-5 space-y-3">
                      {video.quote && (
                        <p className="text-xs text-zinc-300 italic border-l-2 border-[#C19B6C] pl-3 py-0.5">
                          &ldquo;{video.quote}&rdquo;
                        </p>
                      )}
                      <p className="text-[11px] text-zinc-400 font-mono">
                        Video Source: <span className="text-zinc-200">{video.videoUrl}</span>
                      </p>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            setEditingVideo(video);
                            setVideoForm({
                              title: video.title,
                              type: video.type,
                              location: video.location,
                              duration: video.duration,
                              tag: video.tag,
                              poster: video.poster,
                              videoUrl: video.videoUrl,
                              quote: video.quote,
                              couple: video.couple,
                            });
                            setIsVideoModalOpen(true);
                          }}
                          className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-200 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 size={13} />
                          <span>Edit Film</span>
                        </button>
                        <button
                          onClick={() => deleteVideo(video.id)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                          title="Delete film"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: PACKAGES & PRICING (FULL CRUD)                      */}
          {/* ======================================================== */}
          {activeTab === "packages" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Packages &amp; Investment Pricing</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage photography, videography, and signature combo tier prices and deliverable bullets.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingPackageIndex(null);
                    setPackageForm({
                      title: "",
                      subtitle: "",
                      price: "$3,500",
                      features: ["8 Hours Coverage", "Lead Photographer", "Online Gallery"],
                      recommended: false,
                      cta: "Select Package",
                      popular: false,
                    });
                    setIsPackageModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Add Package Tier</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.packages.map((pkg, idx) => (
                  <div
                    key={idx}
                    className={`rounded-3xl p-6 border flex flex-col justify-between space-y-4 shadow-xl transition-all ${pkg.popular || pkg.recommended
                      ? "bg-[#14141c] border-[#C19B6C] ring-1 ring-[#C19B6C]/30"
                      : "bg-[#121217] border-white/10"
                      }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-[#C19B6C]">{pkg.subtitle}</span>
                        {(pkg.popular || pkg.recommended) && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#C19B6C] text-zinc-950 text-[9px] font-bold uppercase tracking-wider">
                            Popular Choice
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white">{pkg.title}</h3>
                        <div className="text-2xl font-bold font-mono text-[#C19B6C] mt-1">{pkg.price}</div>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-white/10">
                        {pkg.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                            <CheckCircle2 size={14} className="text-[#C19B6C] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                      <button
                        onClick={() => {
                          setEditingPackageIndex(idx);
                          setPackageForm({ ...pkg });
                          setIsPackageModalOpen(true);
                        }}
                        className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-200 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 size={13} />
                        <span>Edit Package</span>
                      </button>
                      <button
                        onClick={() => deletePackage(idx)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                        title="Delete package"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: SERVICES & OFFERINGS (FULL CRUD)                    */}
          {/* ======================================================== */}
          {activeTab === "services" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Services &amp; Offerings Manager</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage service cards, photography styles, aerial drone specs, and event offerings.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingServiceIndex(null);
                    setServiceForm({
                      category: "Wedding Cinema & Photo",
                      title: "",
                      desc: "",
                      features: ["Full Day Coverage", "4K HDR Master"],
                      tag: "Featured",
                      image: "/image/bride_portrait.webp",
                    });
                    setIsServiceModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Add New Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.services.map((srv, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl bg-[#121217] border border-white/10 overflow-hidden shadow-xl flex flex-col justify-between hover:border-[#C19B6C]/40 transition-all"
                  >
                    <div className="aspect-[16/9] relative w-full bg-zinc-900">
                      <Image src={srv.image} alt={srv.title} fill className="object-cover" />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/80 text-[10px] font-mono text-[#C19B6C]">
                        {srv.category}
                      </div>
                      {srv.tag && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#C19B6C] text-zinc-950 text-[9px] font-bold uppercase">
                          {srv.tag}
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <h4 className="text-base font-semibold text-white">{srv.title}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">{srv.desc}</p>

                      <div className="space-y-1.5 pt-2 border-t border-white/10">
                        {srv.features.map((f, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-[11px] text-zinc-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C19B6C]" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                        <button
                          onClick={() => {
                            setEditingServiceIndex(idx);
                            setServiceForm({ ...srv });
                            setIsServiceModalOpen(true);
                          }}
                          className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-200 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteService(idx)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                          title="Delete service"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: TESTIMONIALS (FULL CRUD)                           */}
          {/* ======================================================== */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-3xl">
                <div>
                  <h2 className="text-lg font-bold text-white font-mono uppercase tracking-widest">
                    Love Stories & Praise
                  </h2>
                  <p className="text-zinc-500 text-xs mt-1">Manage client testimonials and reviews.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingTestimonialId(null);
                    setTestimonialForm({
                      name: "",
                      venue: "",
                      location: "",
                      date: "",
                      quote: "",
                      message: "",
                      image: "",
                    });
                    setIsTestimonialModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Testimonial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.testimonials?.map((t) => (
                  <div key={t.id} className="relative bg-black/40 border border-white/5 p-5 rounded-3xl group overflow-hidden">
                    <div className="flex gap-4">
                      {t.image && (
                        <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden border border-[#C19B6C]/20">
                          <Image src={t.image} alt={t.name} width={64} height={64} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-white font-bold text-sm">{t.name}</h3>
                        <p className="text-zinc-400 text-xs font-mono mt-0.5">{t.venue} · {t.location} · {t.date}</p>
                        <p className="text-[#C19B6C] font-semibold text-xs italic mt-2">"{t.quote}"</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingTestimonialId(t.id);
                          setTestimonialForm({ ...t });
                          setIsTestimonialModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => deleteTestimonial(t.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {(!content.testimonials || content.testimonials.length === 0) && (
                  <div className="col-span-full py-12 text-center text-zinc-500 text-sm font-mono border-2 border-dashed border-white/10 rounded-3xl">
                    No testimonials found. Add a love story to display it on the site.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT PHOTO                                      */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-[#14141A] border border-[#C19B6C]/40 p-6 space-y-5 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-semibold text-white">
                  {editingPhoto ? "Edit Portfolio Photo" : "Add New Portfolio Photo"}
                </h3>
                <button
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">Photo Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Golden Hour Embrace at Tuscan Villa"
                    value={photoForm.title}
                    onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono uppercase text-zinc-400 block mb-1">Category</label>
                    <select
                      value={photoForm.category}
                      onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                    >
                      {["Weddings", "Bride & Groom", "Couples", "Details & Styling", "Engagement"].map(
                        (cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono uppercase text-zinc-400 block mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Lake Como, Italy"
                      value={photoForm.location}
                      onChange={(e) => setPhotoForm({ ...photoForm, location: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="font-mono uppercase text-zinc-400 block mb-1">
                    Photo Image
                  </label>

                  {/* Image Preview Area */}
                  <div className="relative w-full aspect-video rounded-xl border-2 border-dashed border-white/10 bg-black/30 overflow-hidden flex flex-col items-center justify-center group transition-colors hover:border-[#C19B6C]/50">
                    {photoForm.src ? (
                      <>
                        <Image src={photoForm.src} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <label className="px-4 py-2.5 rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 font-bold uppercase tracking-wider text-xs flex items-center gap-2 cursor-pointer shadow-xl transition-transform hover:scale-105 active:scale-95">
                            {isUploadingPhoto ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
                            <span>{isUploadingPhoto ? "Uploading..." : "Replace Photo"}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isUploadingPhoto} />
                          </label>
                        </div>
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-white/5 transition-colors">
                        {isUploadingPhoto ? (
                          <div className="flex flex-col items-center gap-3 text-[#C19B6C]">
                            <Loader2 size={32} className="animate-spin" />
                            <span className="text-xs font-mono uppercase tracking-widest font-semibold">Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-zinc-400 group-hover:text-[#C19B6C] transition-colors">
                            <UploadCloud size={32} />
                            <span className="text-xs font-mono uppercase tracking-widest font-semibold">Click to Upload Photo</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isUploadingPhoto} />
                      </label>
                    )}
                  </div>
                </div>



                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">Camera Gear &amp; Specs</label>
                  <input
                    type="text"
                    placeholder="e.g. Leica SL2 · 35mm f/1.4 · Natural Light"
                    value={photoForm.specs}
                    onChange={(e) => setPhotoForm({ ...photoForm, specs: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={photoForm.featured}
                    onChange={(e) => setPhotoForm({ ...photoForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#C19B6C]"
                  />
                  <label htmlFor="featured" className="text-xs text-zinc-300 cursor-pointer">
                    Highlight as Featured Masterpiece on Homepage
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePhoto}
                  className="flex-1 py-2.5 rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 text-xs font-bold uppercase tracking-wider"
                >
                  {editingPhoto ? "Update Photo" : "Add to Gallery"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT VIDEO                                      */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-[#14141A] border border-[#C19B6C]/40 p-6 space-y-5 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-semibold text-white">
                  {editingVideo ? "Edit Cinema Film" : "Add New Cinema Film"}
                </h3>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">Film Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Binyam & Elshaday"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono uppercase text-zinc-400 block mb-1">Tag / Type</label>
                    <select
                      value={videoForm.tag}
                      onChange={(e) => setVideoForm({ ...videoForm, tag: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                    >
                      {["Highlight Film", "Feature Film", "Short Teaser", "Elopement Cinema"].map(
                        (tag) => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono uppercase text-zinc-400 block mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 5:20"
                      value={videoForm.duration}
                      onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Dallas Estate, Texas"
                    value={videoForm.location}
                    onChange={(e) => setVideoForm({ ...videoForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">
                    Poster Thumbnail
                  </label>
                  <div className="relative w-full aspect-video rounded-xl border-2 border-dashed border-white/10 bg-black/30 overflow-hidden flex flex-col items-center justify-center group transition-colors hover:border-[#C19B6C]/50">
                    {videoForm.poster ? (
                      <>
                        <Image src={videoForm.poster} alt="Poster" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <label className="px-4 py-2.5 rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 font-bold uppercase tracking-wider text-xs flex items-center gap-2 cursor-pointer shadow-xl transition-transform hover:scale-105 active:scale-95">
                            {isUploadingVideoPoster ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
                            <span>{isUploadingVideoPoster ? "Uploading..." : "Replace Poster"}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleVideoPosterUpload} disabled={isUploadingVideoPoster} />
                          </label>
                        </div>
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-white/5 transition-colors">
                        {isUploadingVideoPoster ? (
                          <div className="flex flex-col items-center gap-3 text-[#C19B6C]">
                            <Loader2 size={32} className="animate-spin" />
                            <span className="text-xs font-mono uppercase tracking-widest font-semibold">Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-zinc-400 group-hover:text-[#C19B6C] transition-colors">
                            <UploadCloud size={32} />
                            <span className="text-xs font-mono uppercase tracking-widest font-semibold">Upload Poster Image</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleVideoPosterUpload} disabled={isUploadingVideoPoster} />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">Video Stream File</label>
                  <div className="relative w-full p-4 rounded-xl border-2 border-dashed border-white/10 bg-black/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-colors hover:border-[#C19B6C]/50">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        {isUploadingVideoFile ? <Loader2 size={20} className="text-[#C19B6C] animate-spin" /> : <Film size={20} className="text-zinc-400" />}
                      </div>
                      <div className="truncate">
                        <span className="text-sm font-semibold text-white block truncate">
                          {videoForm.videoUrl ? videoForm.videoUrl.split('/').pop() : "No video uploaded"}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">
                          {videoForm.videoUrl ? "Ready for streaming" : "MP4 or WebM format"}
                        </span>
                      </div>
                    </div>

                    <label className="shrink-0 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-[10px] flex items-center gap-2 cursor-pointer transition-colors">
                      <UploadCloud size={14} />
                      <span>{isUploadingVideoFile ? "Uploading..." : "Upload Video"}</span>
                      <input type="file" accept="video/*" className="hidden" onChange={handleVideoFileUpload} disabled={isUploadingVideoFile} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">
                    Couple Review Quote
                  </label>
                  <textarea
                    rows={2}
                    value={videoForm.quote}
                    onChange={(e) => setVideoForm({ ...videoForm, quote: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveVideo}
                  className="flex-1 py-2.5 rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 text-xs font-bold uppercase tracking-wider"
                >
                  {editingVideo ? "Update Film" : "Add Film"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT PACKAGE                                    */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isPackageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-[#14141A] border border-[#C19B6C]/40 p-6 space-y-5 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-semibold text-white">
                  {editingPackageIndex !== null ? "Edit Package Tier" : "Add Package Tier"}
                </h3>
                <button
                  onClick={() => setIsPackageModalOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">Package Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Signature Cinema + Photo"
                    value={packageForm.title}
                    onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono uppercase text-zinc-400 block mb-1">Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. The Ultimate Bundle"
                      value={packageForm.subtitle}
                      onChange={(e) => setPackageForm({ ...packageForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-mono uppercase text-zinc-400 block mb-1">Price</label>
                    <input
                      type="text"
                      placeholder="e.g. $6,400"
                      value={packageForm.price}
                      onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Features list */}
                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">
                    Deliverables &amp; Features Included
                  </label>
                  <div className="space-y-2 mb-2">
                    {packageForm.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg">
                        <span className="flex-1 text-zinc-200">{feat}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setPackageForm({
                              ...packageForm,
                              features: packageForm.features.filter((_, i) => i !== fIdx),
                            })
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add another feature item..."
                      value={packageFeatureInput}
                      onChange={(e) => setPackageFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && packageFeatureInput.trim()) {
                          e.preventDefault();
                          setPackageForm({
                            ...packageForm,
                            features: [...packageForm.features, packageFeatureInput.trim()],
                          });
                          setPackageFeatureInput("");
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (packageFeatureInput.trim()) {
                          setPackageForm({
                            ...packageForm,
                            features: [...packageForm.features, packageFeatureInput.trim()],
                          });
                          setPackageFeatureInput("");
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-[#C19B6C] text-zinc-950 font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="pkgPopular"
                    checked={packageForm.popular}
                    onChange={(e) => setPackageForm({ ...packageForm, popular: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#C19B6C]"
                  />
                  <label htmlFor="pkgPopular" className="text-xs text-zinc-300 cursor-pointer">
                    Highlight as Recommended &amp; Most Popular
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setIsPackageModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePackage}
                  className="flex-1 py-2.5 rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 text-xs font-bold uppercase tracking-wider"
                >
                  Save Package
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT SERVICE                                    */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isServiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-[#14141A] border border-[#C19B6C]/40 p-6 space-y-5 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-semibold text-white">
                  {editingServiceIndex !== null ? "Edit Service" : "Add Service"}
                </h3>
                <button
                  onClick={() => setIsServiceModalOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">Service Title</label>
                  <input
                    type="text"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono uppercase text-zinc-400 block mb-1">Category</label>
                    <select
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                    >
                      {["Wedding Cinema & Photo", "Pre-Wedding & Proposals", "Milestones & Events"].map(
                        (cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono uppercase text-zinc-400 block mb-1">Tag Badge</label>
                    <input
                      type="text"
                      placeholder="e.g. Most Requested"
                      value={serviceForm.tag}
                      onChange={(e) => setServiceForm({ ...serviceForm, tag: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={serviceForm.desc}
                    onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">
                    Cover Image
                  </label>
                  <div className="relative w-full aspect-video rounded-xl border-2 border-dashed border-white/10 bg-black/30 overflow-hidden flex flex-col items-center justify-center group transition-colors hover:border-[#C19B6C]/50">
                    {serviceForm.image ? (
                      <>
                        <Image src={serviceForm.image} alt="Service Cover" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <label className="px-4 py-2.5 rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 font-bold uppercase tracking-wider text-xs flex items-center gap-2 cursor-pointer shadow-xl transition-transform hover:scale-105 active:scale-95">
                            {isUploadingServiceImage ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
                            <span>{isUploadingServiceImage ? "Uploading..." : "Replace Cover"}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleServiceImageUpload} disabled={isUploadingServiceImage} />
                          </label>
                        </div>
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-white/5 transition-colors">
                        {isUploadingServiceImage ? (
                          <div className="flex flex-col items-center gap-3 text-[#C19B6C]">
                            <Loader2 size={32} className="animate-spin" />
                            <span className="text-xs font-mono uppercase tracking-widest font-semibold">Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-zinc-400 group-hover:text-[#C19B6C] transition-colors">
                            <UploadCloud size={32} />
                            <span className="text-xs font-mono uppercase tracking-widest font-semibold">Upload Cover Image</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleServiceImageUpload} disabled={isUploadingServiceImage} />
                      </label>
                    )}
                  </div>
                </div>

                {/* Features & Deliverables */}
                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">Service Deliverables</label>
                  <div className="space-y-1.5 mb-2">
                    {serviceForm.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg">
                        <span className="flex-1 text-zinc-200">{feat}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setServiceForm({
                              ...serviceForm,
                              features: serviceForm.features.filter((_, i) => i !== fIdx),
                            })
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add another deliverable item..."
                      value={serviceFeatureInput}
                      onChange={(e) => setServiceFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && serviceFeatureInput.trim()) {
                          e.preventDefault();
                          setServiceForm({
                            ...serviceForm,
                            features: [...serviceForm.features, serviceFeatureInput.trim()],
                          });
                          setServiceFeatureInput("");
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (serviceFeatureInput.trim()) {
                          setServiceForm({
                            ...serviceForm,
                            features: [...serviceForm.features, serviceFeatureInput.trim()],
                          });
                          setServiceFeatureInput("");
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-[#C19B6C] text-zinc-950 font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setIsServiceModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveService}
                  className="flex-1 py-2.5 rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 text-xs font-bold uppercase tracking-wider"
                >
                  Save Service
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT TESTIMONIAL                                */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isTestimonialModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl bg-[#14141A] border border-[#C19B6C]/40 p-6 space-y-5 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-semibold text-white">
                  {editingTestimonialId !== null ? "Edit Testimonial" : "Add Testimonial"}
                </h3>
                <button onClick={() => setIsTestimonialModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono uppercase text-zinc-400 block mb-1">Couple Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Julian & Elena R."
                      value={testimonialForm.name}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-mono uppercase text-zinc-400 block mb-1">Date</label>
                    <input
                      type="text"
                      placeholder="e.g. June 2025"
                      value={testimonialForm.date}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-mono uppercase text-zinc-400 block mb-1">Venue</label>
                    <input
                      type="text"
                      placeholder="e.g. The Milestone Mansion"
                      value={testimonialForm.venue}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, venue: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-mono uppercase text-zinc-400 block mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Dallas, TX"
                      value={testimonialForm.location}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">Highlight Quote (Short)</label>
                  <input
                    type="text"
                    placeholder="e.g. Pure magic preserved forever"
                    value={testimonialForm.quote}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">Full Review Message</label>
                  <textarea
                    rows={4}
                    placeholder="We were worried about feeling stiff..."
                    value={testimonialForm.message}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="font-mono uppercase text-zinc-400 block mb-1">Couple Image</label>
                  <div className="flex items-center gap-4 bg-black/30 border border-white/10 p-3 rounded-xl">
                    {testimonialForm.image && (
                      <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden border border-[#C19B6C]/20">
                        <Image src={testimonialForm.image} alt="Couple" width={48} height={48} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium cursor-pointer w-fit transition-colors">
                        {isUploadingTestimonialImage ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                        <span>{isUploadingTestimonialImage ? "Uploading..." : "Upload New Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleTestimonialFileUpload}
                          disabled={isUploadingTestimonialImage}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTestimonial}
                  className="flex-1 py-2.5 rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Save Testimonial
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
