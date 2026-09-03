import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  query, 
  orderBy,
  Firestore,
  serverTimestamp
} from 'firebase/firestore';

import {
  ArtistProfile,
  MusicRelease,
  MusicVideo,
  PhotoItem,
  SocialLinks,
  SiteSettings
} from '../types';

import {
  initialArtistProfile,
  initialReleases,
  initialMusicVideos,
  initialPhotos,
  initialSocialLinks,
  initialSiteSettings
} from './seedData';

// Environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const AUTHORIZED_ADMIN_UID = import.meta.env.VITE_AUTHORIZED_ADMIN_UID || '';

// Determine if Firebase credentials are fully configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== '' &&
  firebaseConfig.projectId !== ''
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization notice:', error);
  }
}

// -------------------------------------------------------------
// LOCAL STATE STORAGE (Fallback for offline preview & test mode)
// -------------------------------------------------------------
const STORAGE_KEYS = {
  ARTIST: 'tanbyr_artist_profile',
  RELEASES: 'tanbyr_music_releases',
  VIDEOS: 'tanbyr_music_videos',
  PHOTOS: 'tanbyr_photos',
  SOCIAL: 'tanbyr_social_links',
  SETTINGS: 'tanbyr_site_settings',
  DEMO_AUTH: 'tanbyr_demo_admin_authenticated'
};

function getLocalItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('tanbyr_data_updated'));
  } catch (e) {
    console.error('Failed to save to local state:', e);
  }
}

// -------------------------------------------------------------
// REPOSITORY METHODS
// -------------------------------------------------------------

// ARTIST PROFILE
export async function getArtistProfile(): Promise<ArtistProfile> {
  const sanitizeArtist = (data: Partial<ArtistProfile> | null | undefined): ArtistProfile => {
    const merged = { ...initialArtistProfile, ...(data || {}) };
    // Migrate legacy placeholders
    if (merged.location === 'Dhaka, Bangladesh' || merged.location === 'Dhaka') {
      merged.location = '';
    }
    if (merged.country === 'Bangladesh') {
      merged.country = '';
    }
    if (!merged.activeSince || merged.activeSince === '2024') {
      merged.activeSince = '2026';
    }
    if (!merged.genre || merged.genre === 'Contemporary Bengali Indie / Singer-Songwriter' || merged.genre === 'Contemporary Bengali Indie & Soul' || merged.genre === 'Bengali Indie / Pop') {
      merged.genre = '#Banglapop';
    }
    return merged;
  };

  if (db) {
    try {
      const docRef = doc(db, 'artists', 'profile');
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data()) {
        return sanitizeArtist(snap.data() as ArtistProfile);
      }
      // If doc does not exist yet in Firestore, return default
      const local = getLocalItem<ArtistProfile>(STORAGE_KEYS.ARTIST, initialArtistProfile);
      return sanitizeArtist(local);
    } catch (err) {
      console.warn('Error reading artist from Firestore, using local fallback:', err);
    }
  }
  const local = getLocalItem<ArtistProfile>(STORAGE_KEYS.ARTIST, initialArtistProfile);
  return sanitizeArtist(local);
}

export async function updateArtistProfile(profile: ArtistProfile): Promise<void> {
  setLocalItem(STORAGE_KEYS.ARTIST, profile);
  if (db) {
    try {
      const docRef = doc(db, 'artists', 'profile');
      await setDoc(docRef, {
        ...profile,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error('Failed to save artist to Firestore:', err);
      throw err;
    }
  }
}

// RELEASES
export async function getReleases(): Promise<MusicRelease[]> {
  if (db) {
    try {
      const releasesRef = collection(db, 'releases');
      const q = query(releasesRef, orderBy('releaseDate', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MusicRelease[];
      }
    } catch (err) {
      console.warn('Error reading releases from Firestore, using local fallback:', err);
    }
  }
  const local = getLocalItem<MusicRelease[]>(STORAGE_KEYS.RELEASES, initialReleases);
  return [...local].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
}

export async function saveRelease(release: MusicRelease): Promise<void> {
  const current = getLocalItem<MusicRelease[]>(STORAGE_KEYS.RELEASES, initialReleases);
  const exists = current.findIndex(r => r.id === release.id);
  let updated: MusicRelease[];
  if (exists >= 0) {
    updated = current.map(r => r.id === release.id ? release : r);
  } else {
    updated = [release, ...current];
  }
  setLocalItem(STORAGE_KEYS.RELEASES, updated);

  if (db) {
    try {
      const docRef = doc(db, 'releases', release.id);
      await setDoc(docRef, {
        ...release,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error('Failed to save release to Firestore:', err);
      throw err;
    }
  }
}

export async function deleteRelease(id: string): Promise<void> {
  const current = getLocalItem<MusicRelease[]>(STORAGE_KEYS.RELEASES, initialReleases);
  setLocalItem(STORAGE_KEYS.RELEASES, current.filter(r => r.id !== id));

  if (db) {
    try {
      await deleteDoc(doc(db, 'releases', id));
    } catch (err) {
      console.error('Failed to delete release from Firestore:', err);
      throw err;
    }
  }
}

// MUSIC VIDEOS
export async function getMusicVideos(): Promise<MusicVideo[]> {
  if (db) {
    try {
      const videosRef = collection(db, 'musicVideos');
      const q = query(videosRef, orderBy('releaseDate', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MusicVideo[];
      }
    } catch (err) {
      console.warn('Error reading music videos from Firestore:', err);
    }
  }
  return getLocalItem<MusicVideo[]>(STORAGE_KEYS.VIDEOS, initialMusicVideos);
}

export async function saveMusicVideo(video: MusicVideo): Promise<void> {
  const current = getLocalItem<MusicVideo[]>(STORAGE_KEYS.VIDEOS, initialMusicVideos);
  const exists = current.findIndex(v => v.id === video.id);
  const updated = exists >= 0 ? current.map(v => v.id === video.id ? video : v) : [video, ...current];
  setLocalItem(STORAGE_KEYS.VIDEOS, updated);

  if (db) {
    try {
      const docRef = doc(db, 'musicVideos', video.id);
      await setDoc(docRef, {
        ...video,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error('Failed to save video to Firestore:', err);
      throw err;
    }
  }
}

export async function deleteMusicVideo(id: string): Promise<void> {
  const current = getLocalItem<MusicVideo[]>(STORAGE_KEYS.VIDEOS, initialMusicVideos);
  setLocalItem(STORAGE_KEYS.VIDEOS, current.filter(v => v.id !== id));

  if (db) {
    try {
      await deleteDoc(doc(db, 'musicVideos', id));
    } catch (err) {
      console.error('Failed to delete video from Firestore:', err);
      throw err;
    }
  }
}

// PHOTOS
export async function getPhotos(): Promise<PhotoItem[]> {
  if (db) {
    try {
      const photosRef = collection(db, 'photos');
      const q = query(photosRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PhotoItem[];
      }
    } catch (err) {
      console.warn('Error reading photos from Firestore:', err);
    }
  }
  return getLocalItem<PhotoItem[]>(STORAGE_KEYS.PHOTOS, initialPhotos);
}

export async function savePhoto(photo: PhotoItem): Promise<void> {
  const current = getLocalItem<PhotoItem[]>(STORAGE_KEYS.PHOTOS, initialPhotos);
  const exists = current.findIndex(p => p.id === photo.id);
  const updated = exists >= 0 ? current.map(p => p.id === photo.id ? photo : p) : [photo, ...current];
  setLocalItem(STORAGE_KEYS.PHOTOS, updated);

  if (db) {
    try {
      const docRef = doc(db, 'photos', photo.id);
      await setDoc(docRef, {
        ...photo,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error('Failed to save photo to Firestore:', err);
      throw err;
    }
  }
}

export async function deletePhoto(id: string): Promise<void> {
  const current = getLocalItem<PhotoItem[]>(STORAGE_KEYS.PHOTOS, initialPhotos);
  setLocalItem(STORAGE_KEYS.PHOTOS, current.filter(p => p.id !== id));

  if (db) {
    try {
      await deleteDoc(doc(db, 'photos', id));
    } catch (err) {
      console.error('Failed to delete photo from Firestore:', err);
      throw err;
    }
  }
}

// SOCIAL LINKS
export async function getSocialLinks(): Promise<SocialLinks> {
  if (db) {
    try {
      const docRef = doc(db, 'socialLinks', 'default');
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data()) {
        return { ...initialSocialLinks, ...(snap.data() as SocialLinks) };
      }
    } catch (err) {
      console.warn('Error reading social links from Firestore:', err);
    }
  }
  const local = getLocalItem<SocialLinks>(STORAGE_KEYS.SOCIAL, initialSocialLinks);
  return { ...initialSocialLinks, ...(local || {}) };
}

export async function updateSocialLinks(links: SocialLinks): Promise<void> {
  setLocalItem(STORAGE_KEYS.SOCIAL, links);
  if (db) {
    try {
      const docRef = doc(db, 'socialLinks', 'default');
      await setDoc(docRef, {
        ...links,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error('Failed to save social links to Firestore:', err);
      throw err;
    }
  }
}

// SITE SETTINGS / SEO
export async function getSiteSettings(): Promise<SiteSettings> {
  if (db) {
    try {
      const docRef = doc(db, 'siteSettings', 'seo');
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data()) {
        return { ...initialSiteSettings, ...(snap.data() as SiteSettings) };
      }
    } catch (err) {
      console.warn('Error reading site settings from Firestore:', err);
    }
  }
  const local = getLocalItem<SiteSettings>(STORAGE_KEYS.SETTINGS, initialSiteSettings);
  return { ...initialSiteSettings, ...(local || {}) };
}

export async function updateSiteSettings(settings: SiteSettings): Promise<void> {
  setLocalItem(STORAGE_KEYS.SETTINGS, settings);
  if (db) {
    try {
      const docRef = doc(db, 'siteSettings', 'seo');
      await setDoc(docRef, {
        ...settings,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error('Failed to save site settings to Firestore:', err);
      throw err;
    }
  }
}

// -------------------------------------------------------------
// AUTHENTICATION & AUTHORIZATION
// -------------------------------------------------------------

export interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  isDemoAuth: boolean;
}

export async function checkIsAuthorizedAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;

  // 1. Check against environment variable UID if set
  if (AUTHORIZED_ADMIN_UID && user.uid === AUTHORIZED_ADMIN_UID) {
    return true;
  }

  // 2. Check in Firestore 'admins' collection
  if (db) {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists() && adminDoc.data()?.authorized === true) {
        return true;
      }
    } catch (e) {
      console.warn('Admin collection check notice:', e);
    }
  }

  // 3. If no specific UID restriction is configured in env, and user signed in
  // with an admin email account on the configured Firebase project
  if (!AUTHORIZED_ADMIN_UID && user.email) {
    return true;
  }

  return false;
}

export async function loginWithCredentials(email: string, password: string): Promise<{ success: boolean; error?: string; isAuthorized?: boolean }> {
  // If Firebase Auth is ready and configured
  if (auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const isAuth = await checkIsAuthorizedAdmin(cred.user);
      if (!isAuth) {
        return {
          success: false,
          isAuthorized: false,
          error: 'Access Denied: Your account is authenticated, but your UID is not authorized to manage TANBYR Official Website.'
        };
      }
      return { success: true, isAuthorized: true };
    } catch (err: any) {
      let message = 'Invalid admin credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Access temporarily restricted due to multiple failed attempts. Please try again shortly.';
      } else if (err.message) {
        message = err.message;
      }
      return { success: false, error: message };
    }
  }

  // Fallback demo authentication for preview environment
  // Allows testing the admin UI prior to user configuring real Firebase credentials
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail.includes('admin') || cleanEmail.includes('tanbyr') || cleanEmail.includes('tanbir') || cleanEmail.includes('@') || password.length >= 4) {
    localStorage.setItem(STORAGE_KEYS.DEMO_AUTH, 'true');
    window.dispatchEvent(new Event('tanbyr_auth_changed'));
    return { success: true, isAuthorized: true };
  } else {
    // Default allow for seamless preview testing
    localStorage.setItem(STORAGE_KEYS.DEMO_AUTH, 'true');
    window.dispatchEvent(new Event('tanbyr_auth_changed'));
    return { success: true, isAuthorized: true };
  }
}

export function loginDemoAdmin(): { success: boolean; isAuthorized: boolean } {
  localStorage.setItem(STORAGE_KEYS.DEMO_AUTH, 'true');
  window.dispatchEvent(new Event('tanbyr_auth_changed'));
  return { success: true, isAuthorized: true };
}

export async function logoutUser(): Promise<void> {
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error('Sign out error:', e);
    }
  }
  localStorage.removeItem(STORAGE_KEYS.DEMO_AUTH);
  window.dispatchEvent(new Event('tanbyr_auth_changed'));
}

export function subscribeToAuth(callback: (state: AuthState) => void): () => void {
  if (auth) {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin = await checkIsAuthorizedAdmin(firebaseUser);
        callback({
          user: firebaseUser,
          isAdmin,
          loading: false,
          isDemoAuth: false,
        });
      } else {
        const demoAuth = localStorage.getItem(STORAGE_KEYS.DEMO_AUTH) === 'true';
        callback({
          user: null,
          isAdmin: demoAuth,
          loading: false,
          isDemoAuth: demoAuth,
        });
      }
    });
    return unsubscribe;
  }

  // Local fallback listener
  const checkDemo = () => {
    const isDemo = localStorage.getItem(STORAGE_KEYS.DEMO_AUTH) === 'true';
    callback({
      user: null,
      isAdmin: isDemo,
      loading: false,
      isDemoAuth: isDemo,
    });
  };

  window.addEventListener('tanbyr_auth_changed', checkDemo);
  checkDemo();

  return () => {
    window.removeEventListener('tanbyr_auth_changed', checkDemo);
  };
}
