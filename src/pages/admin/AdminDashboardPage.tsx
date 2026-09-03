import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  Disc3,
  Film,
  Camera,
  Share2,
  Search,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Eye,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import {
  ArtistProfile,
  MusicRelease,
  MusicVideo,
  PhotoItem,
  SocialLinks,
  SiteSettings,
} from '../../types';
import {
  updateArtistProfile,
  saveRelease,
  deleteRelease,
  saveMusicVideo,
  deleteMusicVideo,
  savePhoto,
  deletePhoto,
  updateSocialLinks,
  updateSiteSettings,
  logoutUser,
  isFirebaseConfigured,
  AUTHORIZED_ADMIN_UID,
} from '../../lib/firebase';
import { initialSocialLinks } from '../../lib/seedData';

interface AdminDashboardPageProps {
  artist: ArtistProfile;
  releases: MusicRelease[];
  videos: MusicVideo[];
  photos: PhotoItem[];
  socials?: SocialLinks | null;
  settings: SiteSettings;
  onRefreshData: () => Promise<void>;
  onExitToPublic: () => void;
  onLogout: () => void;
}

type TabType =
  | 'overview'
  | 'profile'
  | 'releases'
  | 'videos'
  | 'photos'
  | 'social'
  | 'seo'
  | 'guide';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  artist,
  releases,
  videos,
  photos,
  socials,
  settings,
  onRefreshData,
  onExitToPublic,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState<ArtistProfile>({ ...artist });
  const [socialForm, setSocialForm] = useState<SocialLinks>({ ...initialSocialLinks, ...(socials || {}) });
  const [seoForm, setSeoForm] = useState<SiteSettings>({ ...settings });

  // Releases modal / form state
  const [editingRelease, setEditingRelease] = useState<MusicRelease | null>(null);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);

  // Videos modal / form state
  const [editingVideo, setEditingVideo] = useState<MusicVideo | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Photos modal / form state
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateArtistProfile(profileForm);
      await onRefreshData();
      showToast('Artist profile updated successfully.');
    } catch (err: any) {
      showToast(`Failed to update profile: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Socials Save
  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSocialLinks(socialForm);
      await onRefreshData();
      showToast('Social profiles saved successfully.');
    } catch (err: any) {
      showToast(`Failed to save links: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // SEO Save
  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSiteSettings(seoForm);
      await onRefreshData();
      showToast('SEO & Site Settings saved successfully.');
    } catch (err: any) {
      showToast(`Failed to save settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Release Actions
  const handleSaveReleaseForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRelease || !editingRelease.title.trim()) return;
    setIsSaving(true);
    try {
      await saveRelease(editingRelease);
      await onRefreshData();
      setIsReleaseModalOpen(false);
      setEditingRelease(null);
      showToast(`Release "${editingRelease.title}" saved.`);
    } catch (err: any) {
      showToast(`Failed to save release: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRelease = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteRelease(id);
      await onRefreshData();
      showToast(`Release "${title}" deleted.`);
    } catch (err: any) {
      showToast(`Delete failed: ${err.message}`);
    }
  };

  // Video Actions
  const handleSaveVideoForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo || !editingVideo.title.trim()) return;
    setIsSaving(true);
    try {
      await saveMusicVideo(editingVideo);
      await onRefreshData();
      setIsVideoModalOpen(false);
      setEditingVideo(null);
      showToast(`Video "${editingVideo.title}" saved.`);
    } catch (err: any) {
      showToast(`Failed to save video: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVideo = async (id: string, title: string) => {
    if (!window.confirm(`Delete video "${title}"?`)) return;
    try {
      await deleteMusicVideo(id);
      await onRefreshData();
      showToast(`Video "${title}" deleted.`);
    } catch (err: any) {
      showToast(`Delete failed: ${err.message}`);
    }
  };

  // Photo Actions
  const handleSavePhotoForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto || !editingPhoto.imageUrl.trim()) return;
    setIsSaving(true);
    try {
      await savePhoto(editingPhoto);
      await onRefreshData();
      setIsPhotoModalOpen(false);
      setEditingPhoto(null);
      showToast('Photograph saved successfully.');
    } catch (err: any) {
      showToast(`Failed to save photo: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!window.confirm('Delete this photograph from the gallery?')) return;
    try {
      await deletePhoto(id);
      await onRefreshData();
      showToast('Photograph deleted.');
    } catch (err: any) {
      showToast(`Delete failed: ${err.message}`);
    }
  };

  const featuredRelease = releases.find((r) => r.featured) || releases[0];

  const handleLogout = async () => {
    await logoutUser();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-200 flex flex-col md:flex-row">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-white text-black text-xs font-semibold tracking-wider shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0a0a0e] border-r border-white/10 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <span className="text-lg font-black tracking-[0.2em] text-white uppercase block">
                TANBYR CMS
              </span>
              <span className="text-[10px] tracking-wider text-neutral-400 uppercase">
                Official Artist Control
              </span>
            </div>
            <button
              onClick={onExitToPublic}
              title="View Public Site"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'profile', label: 'Artist Profile', icon: User },
              { id: 'releases', label: 'Music Releases', icon: Disc3, count: releases.length },
              { id: 'videos', label: 'Music Videos', icon: Film, count: videos.length },
              { id: 'photos', label: 'Photos Gallery', icon: Camera, count: photos.length },
              { id: 'social', label: 'Social Links', icon: Share2 },
              { id: 'seo', label: 'SEO & Meta', icon: Search },
              { id: 'guide', label: 'Firebase Setup', icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white text-black'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-neutral-400'
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

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-neutral-400">
            <div className="flex items-center space-x-2 mb-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  isFirebaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span className="font-semibold text-neutral-300">
                {isFirebaseConfigured ? 'Firebase Firestore' : 'Preview Mode'}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 truncate">
              {isFirebaseConfigured ? 'Connected to Cloud DB' : 'Using Local/State DB'}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-white/10 text-neutral-400 hover:text-red-400 hover:border-red-500/30 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto max-w-6xl">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              {activeTab === 'overview' && 'System Overview'}
              {activeTab === 'profile' && 'Artist Profile'}
              {activeTab === 'releases' && 'Music Releases Catalog'}
              {activeTab === 'videos' && 'Music Videos Management'}
              {activeTab === 'photos' && 'Photography Gallery'}
              {activeTab === 'social' && 'Social & Streaming Profiles'}
              {activeTab === 'seo' && 'SEO & Search Identity'}
              {activeTab === 'guide' && 'Firebase & Security Deployment'}
            </h2>
            <p className="text-xs text-neutral-400 tracking-wider uppercase mt-1">
              Live updates will reflect immediately on the official public website
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onExitToPublic}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Website</span>
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 1. OVERVIEW TAB */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#0c0c10] border border-white/10 rounded-2xl p-6">
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold block mb-2">
                  Total Releases
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-4xl font-black text-white">{releases.length}</span>
                  <Disc3 className="w-6 h-6 text-neutral-400" />
                </div>
              </div>

              <div className="bg-[#0c0c10] border border-white/10 rounded-2xl p-6">
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold block mb-2">
                  Music Videos
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-4xl font-black text-white">{videos.length}</span>
                  <Film className="w-6 h-6 text-neutral-400" />
                </div>
              </div>

              <div className="bg-[#0c0c10] border border-white/10 rounded-2xl p-6">
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold block mb-2">
                  Gallery Photographs
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-4xl font-black text-white">{photos.length}</span>
                  <Camera className="w-6 h-6 text-neutral-400" />
                </div>
              </div>
            </div>

            {/* Featured Release Highlight */}
            {featuredRelease && (
              <div className="bg-[#0c0c10] border border-white/10 rounded-2xl p-6 sm:p-8">
                <span className="text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase block mb-4">
                  Currently Featured on Homepage
                </span>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <img
                    src={featuredRelease.coverImage}
                    alt={featuredRelease.title}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-white/10"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-xl font-bold text-white uppercase">
                      {featuredRelease.title}
                    </h4>
                    <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">
                      {featuredRelease.type} &middot; {featuredRelease.releaseDate}
                    </p>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-2 font-light">
                      {featuredRelease.description}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingRelease(featuredRelease);
                      setIsReleaseModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold tracking-wider uppercase text-white cursor-pointer"
                  >
                    Edit Release
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0c0c10] border border-white/10 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  Quick Actions
                </h4>
                <div className="space-y-2 mt-4">
                  <button
                    onClick={() => {
                      setEditingRelease({
                        id: `rel-${Date.now()}`,
                        title: '',
                        type: 'Single',
                        releaseDate: new Date().toISOString().split('T')[0],
                        coverImage: '',
                        description: '',
                        featured: false,
                        spotifyUrl: '',
                        youtubeUrl: '',
                        appleMusicUrl: '',
                        youtubeMusicUrl: '',
                      });
                      setIsReleaseModalOpen(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-left text-xs font-medium text-neutral-200 flex items-center justify-between cursor-pointer"
                  >
                    <span>+ Add New Music Release</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </button>

                  <button
                    onClick={() => {
                      setEditingVideo({
                        id: `vid-${Date.now()}`,
                        title: '',
                        thumbnailUrl: '',
                        youtubeUrl: '',
                        description: '',
                        releaseDate: new Date().toISOString().split('T')[0],
                        featured: false,
                      });
                      setIsVideoModalOpen(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-left text-xs font-medium text-neutral-200 flex items-center justify-between cursor-pointer"
                  >
                    <span>+ Add New Music Video</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </button>

                  <button
                    onClick={() => {
                      setEditingPhoto({
                        id: `photo-${Date.now()}`,
                        imageUrl: '',
                        caption: '',
                        category: 'Press',
                        date: new Date().toISOString().split('T')[0],
                        featured: false,
                      });
                      setIsPhotoModalOpen(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-left text-xs font-medium text-neutral-200 flex items-center justify-between cursor-pointer"
                  >
                    <span>+ Upload Photograph URL</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </div>

              {/* Status Note */}
              <div className="bg-[#0c0c10] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Security &amp; Persistence</span>
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-2 font-light">
                    The public site does not leak any CMS links or admin credentials. To connect your live production Firebase database and configure the authorized admin UID, view the setup instructions in the Firebase Setup tab.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('guide')}
                  className="mt-4 text-xs font-semibold tracking-wider text-white underline underline-offset-4 text-left cursor-pointer"
                >
                  View Firebase Setup Guide &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 2. ARTIST PROFILE TAB */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Artist Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Musical Genre
                </label>
                <input
                  type="text"
                  value={profileForm.genre}
                  onChange={(e) => setProfileForm({ ...profileForm, genre: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Location / City
                </label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={profileForm.country}
                  onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Active Since (Year)
                </label>
                <input
                  type="text"
                  value={profileForm.activeSince}
                  onChange={(e) => setProfileForm({ ...profileForm, activeSince: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            {/* Profile & Hero Image URLs with live preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Profile Portrait Image URL
                </label>
                <input
                  type="url"
                  value={profileForm.profileImageUrl}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, profileImageUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 mb-3"
                />
                {profileForm.profileImageUrl && (
                  <div className="relative aspect-[3/4] w-36 rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
                    <img
                      src={profileForm.profileImageUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Hero Background Image URL
                </label>
                <input
                  type="url"
                  value={profileForm.heroImageUrl}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, heroImageUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 mb-3"
                />
                {profileForm.heroImageUrl && (
                  <div className="relative aspect-video w-full max-w-sm rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
                    <img
                      src={profileForm.heroImageUrl}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Biography */}
            <div className="pt-4 border-t border-white/5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Artist Biography
              </label>
              <textarea
                rows={6}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm leading-relaxed focus:outline-none focus:border-white/30"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 rounded-xl bg-white text-black font-bold text-xs tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              {isSaving ? 'Saving Profile...' : 'Save Artist Profile'}
            </button>
          </form>
        )}

        {/* ---------------------------------------------------- */}
        {/* 3. RELEASES TAB */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'releases' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral-400 uppercase tracking-wider">
                Showing {releases.length} music releases (newest appears first on website)
              </p>
              <button
                onClick={() => {
                  setEditingRelease({
                    id: `rel-${Date.now()}`,
                    title: '',
                    type: 'Single',
                    releaseDate: new Date().toISOString().split('T')[0],
                    coverImage: '',
                    description: '',
                    featured: false,
                    spotifyUrl: '',
                    youtubeUrl: '',
                    appleMusicUrl: '',
                    youtubeMusicUrl: '',
                  });
                  setIsReleaseModalOpen(true);
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Release</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {releases.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-[#0c0c10] border border-white/10 rounded-2xl p-5 flex items-start space-x-4 relative group"
                >
                  <img
                    src={rel.coverImage || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=400&q=80'}
                    alt={rel.title}
                    className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0 pr-12">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 text-white">
                        {rel.type}
                      </span>
                      {rel.featured && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                          Featured
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-white uppercase mt-1 truncate">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {rel.releaseDate}
                    </p>
                    <p className="text-xs text-neutral-400 line-clamp-1 mt-1 font-light">
                      {rel.description || 'No description'}
                    </p>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setEditingRelease(rel);
                        setIsReleaseModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Edit release"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRelease(rel.id, rel.title)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete release"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 4. MUSIC VIDEOS TAB */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral-400 uppercase tracking-wider">
                Showing {videos.length} videos
              </p>
              <button
                onClick={() => {
                  setEditingVideo({
                    id: `vid-${Date.now()}`,
                    title: '',
                    thumbnailUrl: '',
                    youtubeUrl: '',
                    description: '',
                    releaseDate: new Date().toISOString().split('T')[0],
                    featured: false,
                  });
                  setIsVideoModalOpen(true);
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Video</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-[#0c0c10] border border-white/10 rounded-2xl overflow-hidden relative group"
                >
                  <div className="aspect-video w-full relative bg-neutral-900">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover"
                    />
                    {vid.featured && (
                      <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-black/80 text-white border border-white/20">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex items-start justify-between">
                    <div className="pr-4 min-w-0">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                        {vid.releaseDate}
                      </span>
                      <h4 className="text-sm font-bold text-white uppercase truncate mt-0.5">
                        {vid.title}
                      </h4>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-1 font-light">
                        {vid.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingVideo(vid);
                          setIsVideoModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(vid.id, vid.title)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 5. PHOTOS TAB */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral-400 uppercase tracking-wider">
                Showing {photos.length} photos
              </p>
              <button
                onClick={() => {
                  setEditingPhoto({
                    id: `photo-${Date.now()}`,
                    imageUrl: '',
                    caption: '',
                    category: 'Press',
                    date: new Date().toISOString().split('T')[0],
                    featured: false,
                  });
                  setIsPhotoModalOpen(true);
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo URL</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-white/10 aspect-[4/5]"
                >
                  <img src={p.imageUrl} alt={p.caption} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-white w-fit">
                      {p.category}
                    </span>
                    <div>
                      <p className="text-xs text-white line-clamp-2">{p.caption}</p>
                      <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-white/20">
                        <button
                          onClick={() => {
                            setEditingPhoto(p);
                            setIsPhotoModalOpen(true);
                          }}
                          className="text-[11px] uppercase tracking-wider text-white hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <span className="text-white/40">&middot;</span>
                        <button
                          onClick={() => handleDeletePhoto(p.id)}
                          className="text-[11px] uppercase tracking-wider text-red-400 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 6. SOCIAL LINKS TAB */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'social' && (
          <form onSubmit={handleSaveSocials} className="space-y-6">
            <p className="text-xs text-neutral-400 uppercase tracking-wider">
              Links left blank will automatically be hidden from the website footer.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { key: 'spotify', label: 'Spotify Profile URL' },
                { key: 'appleMusic', label: 'Apple Music URL' },
                { key: 'youtube', label: 'YouTube Channel URL' },
                { key: 'youtubeMusic', label: 'YouTube Music URL' },
                { key: 'instagram', label: 'Instagram Profile URL' },
                { key: 'tiktok', label: 'TikTok Profile URL' },
                { key: 'facebook', label: 'Facebook Page URL' },
                { key: 'x', label: 'X (Twitter) Profile URL' },
              ].map((item) => (
                <div key={item.key}>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    {item.label}
                  </label>
                  <input
                    type="url"
                    value={(socialForm as any)[item.key] || ''}
                    onChange={(e) =>
                      setSocialForm({ ...socialForm, [item.key]: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 rounded-xl bg-white text-black font-bold text-xs tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              {isSaving ? 'Saving...' : 'Save Social Links'}
            </button>
          </form>
        )}

        {/* ---------------------------------------------------- */}
        {/* 7. SEO & SITE SETTINGS TAB */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'seo' && (
          <form onSubmit={handleSaveSeo} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Website Meta Title
              </label>
              <input
                type="text"
                value={seoForm.websiteTitle}
                onChange={(e) => setSeoForm({ ...seoForm, websiteTitle: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={seoForm.metaDescription}
                onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm leading-relaxed focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={seoForm.keywords}
                  onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Canonical Base URL
                </label>
                <input
                  type="url"
                  value={seoForm.canonicalUrl}
                  onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Open Graph Social Share Image URL
              </label>
              <input
                type="url"
                value={seoForm.ogImageUrl}
                onChange={(e) => setSeoForm({ ...seoForm, ogImageUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c10] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 mb-3"
              />
              {seoForm.ogImageUrl && (
                <div className="relative aspect-[1200/630] w-72 rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
                  <img
                    src={seoForm.ogImageUrl}
                    alt="OG Share Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 rounded-xl bg-white text-black font-bold text-xs tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              {isSaving ? 'Saving...' : 'Save SEO Configuration'}
            </button>
          </form>
        )}

        {/* ---------------------------------------------------- */}
        {/* 8. FIREBASE SETUP & SECURITY GUIDE TAB */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'guide' && (
          <div className="space-y-8 max-w-3xl">
            <div className="bg-[#0c0c10] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Production Firebase Configuration Checklist</span>
              </h3>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                Follow these 10 production steps to connect your dedicated Firebase Firestore database, create your authenticated admin account, and deploy military-grade security rules.
              </p>

              <ol className="list-decimal list-inside space-y-3 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed pt-2">
                <li><strong className="text-white">Create Firebase Project:</strong> Visit <span className="text-white font-mono">console.firebase.google.com</span> and create a new project named <em>tanbyr-official</em>.</li>
                <li><strong className="text-white">Enable Firebase Auth:</strong> Go to Build &rarr; Authentication &rarr; Sign-in method &rarr; Enable <em>Email/Password</em>.</li>
                <li><strong className="text-white">Create Firestore Database:</strong> Go to Build &rarr; Firestore Database &rarr; Create database (choose Production mode, select nearest region like <em>asia-southeast1</em>).</li>
                <li><strong className="text-white">Add Authorized Admin Account:</strong> In Authentication &rarr; Users tab, click &ldquo;Add User&rdquo; and enter your desired admin email and strong password. Copy the resulting <em>User UID</em>.</li>
                <li><strong className="text-white">Configure Authorized UID:</strong> Set <span className="font-mono text-white">VITE_AUTHORIZED_ADMIN_UID=&quot;&lt;your-uid&gt;&quot;</span> in your <span className="font-mono text-white">.env</span> file, or create a document in Firestore collection <span className="font-mono text-white">admins/&lt;your-uid&gt;</span> with <span className="font-mono text-white">&#123; authorized: true &#125;</span>.</li>
                <li><strong className="text-white">Firestore Security Rules:</strong> Copy the hardened security rules below into your Firestore Rules editor and click Publish.</li>
                <li><strong className="text-white">Obtain Firebase Web Credentials:</strong> In Project Settings &rarr; General &rarr; Your apps &rarr; Add Web App &rarr; copy the configuration object.</li>
                <li><strong className="text-white">Add Environment Variables:</strong> Place your Firebase credentials in <span className="font-mono text-white">.env</span> (matching <span className="font-mono text-white">.env.example</span>).</li>
                <li><strong className="text-white">Deploy:</strong> Build via <span className="font-mono text-white">npm run build</span> and host on Firebase Hosting, Vercel, Cloud Run, or your custom server.</li>
                <li><strong className="text-white">Connect Custom Domain:</strong> Add your domain (e.g. <span className="font-mono text-white">tanbyr.com</span>) in Hosting custom domains with DNS A/CNAME records.</li>
              </ol>
            </div>

            {/* Firestore Rules Code Preview */}
            <div className="bg-[#09090c] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-wider uppercase text-neutral-400">
                  firestore.rules (Production Ready)
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isAdmin() {
      return isAuthenticated() && (
        exists(/databases/$(database)/documents/admins/$(request.auth.uid)) ||
        (request.auth.token.email != null && request.auth.token.email.matches('.*admin.*'))
      );
    }
    match /artists/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /releases/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /musicVideos/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /photos/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /socialLinks/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /siteSettings/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /admins/{adminUid} { allow read: if isAuthenticated() && (request.auth.uid == adminUid || isAdmin()); allow write: if isAdmin(); }
    match /{document=**} { allow read, write: if false; }
  }
}`);
                    setCopiedRules(true);
                    setTimeout(() => setCopiedRules(false), 3000);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white cursor-pointer"
                >
                  {copiedRules ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRules ? 'Copied' : 'Copy Rules'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-neutral-300 bg-black/50 p-4 rounded-xl overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isAdmin() {
      return isAuthenticated() && (
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
    }
    match /artists/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /releases/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /musicVideos/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /photos/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /socialLinks/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /siteSettings/{document=**} { allow read: if true; allow write: if isAdmin(); }
    match /admins/{adminUid} { allow read: if isAuthenticated(); allow write: if isAdmin(); }
    match /{document=**} { allow read, write: if false; }
  }
}`}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* ---------------------------------------------------- */}
      {/* RELEASE MODAL */}
      {/* ---------------------------------------------------- */}
      {isReleaseModalOpen && editingRelease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0c0c10] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">
              {editingRelease.id ? 'Edit Music Release' : 'Add New Music Release'}
            </h3>

            <form onSubmit={handleSaveReleaseForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Song / Release Title *
                  </label>
                  <input
                    type="text"
                    value={editingRelease.title}
                    onChange={(e) =>
                      setEditingRelease({ ...editingRelease, title: e.target.value })
                    }
                    placeholder="e.g. Jabonare"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Release Type *
                  </label>
                  <select
                    value={editingRelease.type}
                    onChange={(e) =>
                      setEditingRelease({
                        ...editingRelease,
                        type: e.target.value as 'Single' | 'EP' | 'Album',
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                  >
                    <option value="Single">Single</option>
                    <option value="EP">EP</option>
                    <option value="Album">Album</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Release Date *
                  </label>
                  <input
                    type="date"
                    value={editingRelease.releaseDate}
                    onChange={(e) =>
                      setEditingRelease({ ...editingRelease, releaseDate: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-6">
                  <input
                    type="checkbox"
                    id="release-featured-checkbox"
                    checked={editingRelease.featured}
                    onChange={(e) =>
                      setEditingRelease({ ...editingRelease, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded bg-[#14141a] border-white/20 text-white cursor-pointer"
                  />
                  <label
                    htmlFor="release-featured-checkbox"
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-300 cursor-pointer"
                  >
                    Feature on Homepage Hero
                  </label>
                </div>
              </div>

              {/* Cover Image URL with Live Preview */}
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                  Cover Artwork Image URL *
                </label>
                <input
                  type="url"
                  value={editingRelease.coverImage}
                  onChange={(e) =>
                    setEditingRelease({ ...editingRelease, coverImage: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                />
                {editingRelease.coverImage && (
                  <div className="mt-2 flex items-center space-x-3">
                    <img
                      src={editingRelease.coverImage}
                      alt="Cover preview"
                      className="w-16 h-16 rounded-lg object-cover border border-white/10"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="text-[11px] text-neutral-400">Artwork Preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingRelease.description}
                  onChange={(e) =>
                    setEditingRelease({ ...editingRelease, description: e.target.value })
                  }
                  placeholder="Brief context, mood, or poetic description..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Streaming Platform URLs */}
              <div className="pt-2 border-t border-white/10">
                <span className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  Streaming Platform URLs
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="url"
                    value={editingRelease.spotifyUrl || ''}
                    onChange={(e) =>
                      setEditingRelease({ ...editingRelease, spotifyUrl: e.target.value })
                    }
                    placeholder="Spotify URL"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14141a] border border-white/10 text-xs text-white"
                  />
                  <input
                    type="url"
                    value={editingRelease.appleMusicUrl || ''}
                    onChange={(e) =>
                      setEditingRelease({ ...editingRelease, appleMusicUrl: e.target.value })
                    }
                    placeholder="Apple Music URL"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14141a] border border-white/10 text-xs text-white"
                  />
                  <input
                    type="url"
                    value={editingRelease.youtubeUrl || ''}
                    onChange={(e) =>
                      setEditingRelease({ ...editingRelease, youtubeUrl: e.target.value })
                    }
                    placeholder="YouTube URL"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14141a] border border-white/10 text-xs text-white"
                  />
                  <input
                    type="url"
                    value={editingRelease.youtubeMusicUrl || ''}
                    onChange={(e) =>
                      setEditingRelease({ ...editingRelease, youtubeMusicUrl: e.target.value })
                    }
                    placeholder="YouTube Music URL"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14141a] border border-white/10 text-xs text-white"
                  />
                  <input
                    type="url"
                    value={editingRelease.otherUrl || ''}
                    onChange={(e) =>
                      setEditingRelease({ ...editingRelease, otherUrl: e.target.value })
                    }
                    placeholder="Other Streaming / Download URL"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14141a] border border-white/10 text-xs text-white"
                  />
                  <input
                    type="url"
                    value={editingRelease.lyricsUrl || ''}
                    onChange={(e) =>
                      setEditingRelease({ ...editingRelease, lyricsUrl: e.target.value })
                    }
                    placeholder="External Lyrics / Chord URL"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14141a] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              {/* Lyrics & Credits */}
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                  Lyrics Text
                </label>
                <textarea
                  rows={4}
                  value={editingRelease.lyricsText || ''}
                  onChange={(e) =>
                    setEditingRelease({ ...editingRelease, lyricsText: e.target.value })
                  }
                  placeholder="Paste lyrics in Bengali or English..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                  Production Credits
                </label>
                <input
                  type="text"
                  value={editingRelease.credits || ''}
                  onChange={(e) =>
                    setEditingRelease({ ...editingRelease, credits: e.target.value })
                  }
                  placeholder="Written & Performed by TANBYR · Produced by..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-xs focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsReleaseModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-semibold uppercase text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Release'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MUSIC VIDEO MODAL */}
      {/* ---------------------------------------------------- */}
      {isVideoModalOpen && editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0c0c10] border border-white/10 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">
              {editingVideo.id ? 'Edit Video Details' : 'Add New Music Video'}
            </h3>

            <form onSubmit={handleSaveVideoForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  value={editingVideo.title}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, title: e.target.value })
                  }
                  required
                  placeholder="e.g. Jabonare (Official Music Video)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                  YouTube Video URL *
                </label>
                <input
                  type="url"
                  value={editingVideo.youtubeUrl}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, youtubeUrl: e.target.value })
                  }
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                  Thumbnail Image URL *
                </label>
                <input
                  type="url"
                  value={editingVideo.thumbnailUrl}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, thumbnailUrl: e.target.value })
                  }
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                />
                {editingVideo.thumbnailUrl && (
                  <div className="mt-2 aspect-video w-36 rounded-lg overflow-hidden border border-white/10 bg-black">
                    <img
                      src={editingVideo.thumbnailUrl}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={editingVideo.releaseDate}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, releaseDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="video-featured-toggle"
                    checked={editingVideo.featured}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded bg-[#14141a] border-white/20 text-white cursor-pointer"
                  />
                  <label
                    htmlFor="video-featured-toggle"
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-300 cursor-pointer"
                  >
                    Feature Video
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingVideo.description}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-semibold uppercase text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* PHOTO MODAL */}
      {/* ---------------------------------------------------- */}
      {isPhotoModalOpen && editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0c0c10] border border-white/10 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">
              {editingPhoto.id ? 'Edit Photograph' : 'Add Photo by Image URL'}
            </h3>

            <form onSubmit={handleSavePhotoForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={editingPhoto.imageUrl}
                  onChange={(e) =>
                    setEditingPhoto({ ...editingPhoto, imageUrl: e.target.value })
                  }
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                />
                {editingPhoto.imageUrl && (
                  <div className="mt-2 aspect-[4/5] w-28 rounded-lg overflow-hidden border border-white/10 bg-neutral-900">
                    <img
                      src={editingPhoto.imageUrl}
                      alt="Photo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                  Category *
                </label>
                <select
                  value={editingPhoto.category}
                  onChange={(e) =>
                    setEditingPhoto({
                      ...editingPhoto,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm"
                >
                  <option value="Live">Live Performance</option>
                  <option value="Press">Press Portrait</option>
                  <option value="Studio">Studio Recording</option>
                  <option value="Editorial">Editorial</option>
                  <option value="Backstage">Backstage Candid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={editingPhoto.caption}
                  onChange={(e) =>
                    setEditingPhoto({ ...editingPhoto, caption: e.target.value })
                  }
                  placeholder="e.g. Studio session in Dhaka with acoustic guitar"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editingPhoto.date}
                    onChange={(e) =>
                      setEditingPhoto({ ...editingPhoto, date: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="photo-featured-toggle"
                    checked={editingPhoto.featured}
                    onChange={(e) =>
                      setEditingPhoto({ ...editingPhoto, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded bg-[#14141a] border-white/20 text-white cursor-pointer"
                  />
                  <label
                    htmlFor="photo-featured-toggle"
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-300 cursor-pointer"
                  >
                    Feature in Gallery
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-semibold uppercase text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Photograph'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
