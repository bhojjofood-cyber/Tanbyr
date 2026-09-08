import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
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

import firebaseAppletConfig from '../../firebase-applet-config.json';

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

import { verifyAdminPassword } from './cryptoUtils';

// Configuration loaded from provisioned firebase-applet-config.json with environment fallback
const appletCfg: Record<string, any> = (typeof firebaseAppletConfig === 'object' && firebaseAppletConfig !== null)
  ? firebaseAppletConfig
  : {};

const firebaseConfig = {
  apiKey: appletCfg.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: appletCfg.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: appletCfg.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: appletCfg.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: appletCfg.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: appletCfg.appId || import.meta.env.VITE_FIREBASE_APP_ID || '',
  firestoreDatabaseId: appletCfg.firestoreDatabaseId || '',
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
    db = firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
    console.log(
      '[Firebase] Firestore initialized successfully. Project:',
      firebaseConfig.projectId,
      'Database:',
      firebaseConfig.firestoreDatabaseId || '(default)'
    );
  } catch (error) {
    console.warn('Firebase initialization notice:', error);
  }
}

// Utility to clean undefined fields before sending to Firestore
function cleanFirestoreData<T extends Record<string, any>>(obj: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
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

function setLocalItem<T>(key: string, data: T, emitEvent = false): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    if (emitEvent) {
      window.dispatchEvent(new Event('tanbyr_data_updated'));
    }
  } catch (e) {
    console.error('Failed to save to local state:', e);
  }
}

// -------------------------------------------------------------
// REPOSITORY METHODS
// -------------------------------------------------------------

// ARTIST PROFILE
export async function getArtistProfile(): Promise<ArtistProfile> {
  if (db) {
    try {
      const docRef = doc(db, 'artists', 'profile');
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data()) {
        const remote = { ...initialArtistProfile, ...(snap.data() as ArtistProfile) };
        setLocalItem(STORAGE_KEYS.ARTIST, remote, false);
        return remote;
      }
      // Seed to Firestore if not present yet
      const initial = initialArtistProfile;
      try {
        await setDoc(docRef, {
          ...cleanFirestoreData(initial),
          updatedAt: serverTimestamp()
        });
        console.log('[Firebase] Initial artist profile seeded to Firestore');
      } catch (seedErr) {
        console.warn('[Firebase] Seed artist profile notice:', seedErr);
      }
      return initial;
    } catch (err) {
      console.warn('Error reading artist from Firestore, using local fallback:', err);
    }
  }
  const local = getLocalItem<ArtistProfile>(STORAGE_KEYS.ARTIST, initialArtistProfile);
  return { ...initialArtistProfile, ...(local || {}) };
}

export async function updateArtistProfile(profile: ArtistProfile): Promise<void> {
  if (db) {
    try {
      const docRef = doc(db, 'artists', 'profile');
      await setDoc(docRef, {
        ...cleanFirestoreData(profile),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log('[Firebase] Successfully saved artist profile to Firestore');
    } catch (err) {
      console.error('Failed to save artist to Firestore:', err);
      throw err;
    }
  }
  setLocalItem(STORAGE_KEYS.ARTIST, profile, true);
}

// RELEASES
export async function getReleases(): Promise<MusicRelease[]> {
  if (db) {
    try {
      const releasesRef = collection(db, 'releases');
      const q = query(releasesRef, orderBy('releaseDate', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MusicRelease[];
        setLocalItem(STORAGE_KEYS.RELEASES, items, false);
        return items;
      }
      // Seed initial releases if Firestore collection is empty
      try {
        for (const rel of initialReleases) {
          await setDoc(doc(db, 'releases', rel.id), {
            ...cleanFirestoreData(rel),
            updatedAt: serverTimestamp()
          });
        }
        console.log('[Firebase] Initial releases seeded to Firestore');
      } catch (seedErr) {
        console.warn('[Firebase] Seed releases notice:', seedErr);
      }
    } catch (err) {
      console.warn('Error reading releases from Firestore, using local fallback:', err);
    }
  }
  const local = getLocalItem<MusicRelease[]>(STORAGE_KEYS.RELEASES, initialReleases);
  return [...local].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
}

export async function saveRelease(release: MusicRelease): Promise<void> {
  if (db) {
    try {
      const docRef = doc(db, 'releases', release.id);
      await setDoc(docRef, {
        ...cleanFirestoreData(release),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log('[Firebase] Successfully saved release to Firestore:', release.id);
    } catch (err) {
      console.error('Failed to save release to Firestore:', err);
      throw err;
    }
  }
  const current = getLocalItem<MusicRelease[]>(STORAGE_KEYS.RELEASES, initialReleases);
  const exists = current.findIndex(r => r.id === release.id);
  let updated: MusicRelease[];
  if (exists >= 0) {
    updated = current.map(r => r.id === release.id ? release : r);
  } else {
    updated = [release, ...current];
  }
  setLocalItem(STORAGE_KEYS.RELEASES, updated, true);
}

export async function deleteRelease(id: string): Promise<void> {
  if (db) {
    try {
      await deleteDoc(doc(db, 'releases', id));
      console.log('[Firebase] Successfully deleted release from Firestore:', id);
    } catch (err) {
      console.error('Failed to delete release from Firestore:', err);
      throw err;
    }
  }
  const current = getLocalItem<MusicRelease[]>(STORAGE_KEYS.RELEASES, initialReleases);
  setLocalItem(STORAGE_KEYS.RELEASES, current.filter(r => r.id !== id), true);
}

// MUSIC VIDEOS
export async function getMusicVideos(): Promise<MusicVideo[]> {
  if (db) {
    try {
      const videosRef = collection(db, 'musicVideos');
      const q = query(videosRef, orderBy('releaseDate', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MusicVideo[];
        setLocalItem(STORAGE_KEYS.VIDEOS, items, false);
        return items;
      }
      // Seed initial videos if Firestore is empty
      try {
        for (const vid of initialMusicVideos) {
          await setDoc(doc(db, 'musicVideos', vid.id), {
            ...cleanFirestoreData(vid),
            updatedAt: serverTimestamp()
          });
        }
        console.log('[Firebase] Initial music videos seeded to Firestore');
      } catch (seedErr) {
        console.warn('[Firebase] Seed music videos notice:', seedErr);
      }
    } catch (err) {
      console.warn('Error reading music videos from Firestore:', err);
    }
  }
  return getLocalItem<MusicVideo[]>(STORAGE_KEYS.VIDEOS, initialMusicVideos);
}

export async function saveMusicVideo(video: MusicVideo): Promise<void> {
  if (db) {
    try {
      const docRef = doc(db, 'musicVideos', video.id);
      await setDoc(docRef, {
        ...cleanFirestoreData(video),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log('[Firebase] Successfully saved music video to Firestore:', video.id);
    } catch (err) {
      console.error('Failed to save video to Firestore:', err);
      throw err;
    }
  }
  const current = getLocalItem<MusicVideo[]>(STORAGE_KEYS.VIDEOS, initialMusicVideos);
  const exists = current.findIndex(v => v.id === video.id);
  const updated = exists >= 0 ? current.map(v => v.id === video.id ? video : v) : [video, ...current];
  setLocalItem(STORAGE_KEYS.VIDEOS, updated, true);
}

export async function deleteMusicVideo(id: string): Promise<void> {
  if (db) {
    try {
      await deleteDoc(doc(db, 'musicVideos', id));
      console.log('[Firebase] Successfully deleted video from Firestore:', id);
    } catch (err) {
      console.error('Failed to delete video from Firestore:', err);
      throw err;
    }
  }
  const current = getLocalItem<MusicVideo[]>(STORAGE_KEYS.VIDEOS, initialMusicVideos);
  setLocalItem(STORAGE_KEYS.VIDEOS, current.filter(v => v.id !== id), true);
}

// PHOTOS
export async function getPhotos(): Promise<PhotoItem[]> {
  if (db) {
    try {
      const photosRef = collection(db, 'photos');
      const q = query(photosRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PhotoItem[];
        setLocalItem(STORAGE_KEYS.PHOTOS, items, false);
        return items;
      }
      // Seed initial photos if Firestore is empty
      try {
        for (const p of initialPhotos) {
          await setDoc(doc(db, 'photos', p.id), {
            ...cleanFirestoreData(p),
            updatedAt: serverTimestamp()
          });
        }
        console.log('[Firebase] Initial photos seeded to Firestore');
      } catch (seedErr) {
        console.warn('[Firebase] Seed photos notice:', seedErr);
      }
    } catch (err) {
      console.warn('Error reading photos from Firestore:', err);
    }
  }
  return getLocalItem<PhotoItem[]>(STORAGE_KEYS.PHOTOS, initialPhotos);
}

export async function savePhoto(photo: PhotoItem): Promise<void> {
  if (db) {
    try {
      const docRef = doc(db, 'photos', photo.id);
      await setDoc(docRef, {
        ...cleanFirestoreData(photo),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log('[Firebase] Successfully saved photo to Firestore:', photo.id);
    } catch (err) {
      console.error('Failed to save photo to Firestore:', err);
      throw err;
    }
  }
  const current = getLocalItem<PhotoItem[]>(STORAGE_KEYS.PHOTOS, initialPhotos);
  const exists = current.findIndex(p => p.id === photo.id);
  const updated = exists >= 0 ? current.map(p => p.id === photo.id ? photo : p) : [photo, ...current];
  setLocalItem(STORAGE_KEYS.PHOTOS, updated, true);
}

export async function deletePhoto(id: string): Promise<void> {
  if (db) {
    try {
      await deleteDoc(doc(db, 'photos', id));
      console.log('[Firebase] Successfully deleted photo from Firestore:', id);
    } catch (err) {
      console.error('Failed to delete photo from Firestore:', err);
      throw err;
    }
  }
  const current = getLocalItem<PhotoItem[]>(STORAGE_KEYS.PHOTOS, initialPhotos);
  setLocalItem(STORAGE_KEYS.PHOTOS, current.filter(p => p.id !== id), true);
}

// SOCIAL LINKS
export async function getSocialLinks(): Promise<SocialLinks> {
  if (db) {
    try {
      const docRef = doc(db, 'socialLinks', 'default');
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data()) {
        const remote = { ...initialSocialLinks, ...(snap.data() as SocialLinks) };
        setLocalItem(STORAGE_KEYS.SOCIAL, remote, false);
        return remote;
      }
      // Seed default social links to Firestore
      try {
        await setDoc(docRef, {
          ...cleanFirestoreData(initialSocialLinks),
          updatedAt: serverTimestamp()
        });
        console.log('[Firebase] Initial social links seeded to Firestore');
      } catch (seedErr) {
        console.warn('[Firebase] Seed social links notice:', seedErr);
      }
    } catch (err) {
      console.warn('Error reading social links from Firestore:', err);
    }
  }
  const local = getLocalItem<SocialLinks>(STORAGE_KEYS.SOCIAL, initialSocialLinks);
  return { ...initialSocialLinks, ...(local || {}) };
}

export async function updateSocialLinks(links: SocialLinks): Promise<void> {
  if (db) {
    try {
      const docRef = doc(db, 'socialLinks', 'default');
      await setDoc(docRef, {
        ...cleanFirestoreData(links),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log('[Firebase] Successfully saved social links to Firestore');
    } catch (err) {
      console.error('Failed to save social links to Firestore:', err);
      throw err;
    }
  }
  setLocalItem(STORAGE_KEYS.SOCIAL, links, true);
}

// SITE SETTINGS / SEO
export async function getSiteSettings(): Promise<SiteSettings> {
  if (db) {
    try {
      const docRef = doc(db, 'siteSettings', 'seo');
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data()) {
        const remote = { ...initialSiteSettings, ...(snap.data() as SiteSettings) };
        setLocalItem(STORAGE_KEYS.SETTINGS, remote, false);
        return remote;
      }
      // Seed default SEO settings to Firestore
      try {
        await setDoc(docRef, {
          ...cleanFirestoreData(initialSiteSettings),
          updatedAt: serverTimestamp()
        });
        console.log('[Firebase] Initial SEO settings seeded to Firestore');
      } catch (seedErr) {
        console.warn('[Firebase] Seed SEO notice:', seedErr);
      }
    } catch (err) {
      console.warn('Error reading site settings from Firestore:', err);
    }
  }
  const local = getLocalItem<SiteSettings>(STORAGE_KEYS.SETTINGS, initialSiteSettings);
  return { ...initialSiteSettings, ...(local || {}) };
}

export async function updateSiteSettings(settings: SiteSettings): Promise<void> {
  if (db) {
    try {
      const docRef = doc(db, 'siteSettings', 'seo');
      await setDoc(docRef, {
        ...cleanFirestoreData(settings),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log('[Firebase] Successfully saved site settings to Firestore');
    } catch (err) {
      console.error('Failed to save site settings to Firestore:', err);
      throw err;
    }
  }
  setLocalItem(STORAGE_KEYS.SETTINGS, settings, true);
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

// SHA-256 cryptographic hash of the authorized admin unlock password
// The password remains completely private and is never stored in plaintext
const DEFAULT_ADMIN_HASH = '950fd8f02b5eb8659aaf461616b6e20be5ea56089a3e2155a3bf493dbc10a4b1';

/**
 * Validates the admin unlock password using cryptographic SHA-256 matching.
 * Keeps the master password private without storing plaintext in source code.
 * Requires the user to enter the authorized password to unlock the admin panel.
 */
export async function unlockAdminWithPassword(
  inputPassword: string
): Promise<{ success: boolean; error?: string }> {
  const cleanInput = (inputPassword || '').trim();
  if (!cleanInput) {
    return { success: false, error: 'Please enter the admin password.' };
  }

  try {
    const targetHash = (
      import.meta.env.VITE_ADMIN_PASSWORD_HASH || DEFAULT_ADMIN_HASH
    ).toLowerCase();

    const isMatch = await verifyAdminPassword(cleanInput, targetHash);

    if (isMatch) {
      sessionStorage.setItem('tanbyr_admin_session_unlocked', 'true');
      try {
        localStorage.removeItem(STORAGE_KEYS.DEMO_AUTH);
      } catch {
        // ignore
      }
      window.dispatchEvent(new Event('tanbyr_auth_changed'));
      return { success: true };
    }

    return { success: false, error: 'Incorrect password. Access denied.' };
  } catch (err: any) {
    console.error('Password verification error:', err);
    return { success: false, error: 'Verification error. Please try again.' };
  }
}

export function lockAdminSession(): void {
  try {
    sessionStorage.removeItem('tanbyr_admin_session_unlocked');
    localStorage.removeItem(STORAGE_KEYS.DEMO_AUTH);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event('tanbyr_auth_changed'));
}

export async function loginWithCredentials(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; isAuthorized?: boolean }> {
  if (auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const isAuth = await checkIsAuthorizedAdmin(cred.user);
      if (!isAuth) {
        return {
          success: false,
          isAuthorized: false,
          error:
            'Access Denied: Your account is authenticated, but your UID is not authorized to manage TANBYR Official Website.',
        };
      }
      sessionStorage.setItem('tanbyr_admin_session_unlocked', 'true');
      window.dispatchEvent(new Event('tanbyr_auth_changed'));
      return { success: true, isAuthorized: true };
    } catch (err: any) {
      let message = 'Invalid admin credentials.';
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        message = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        message =
          'Access temporarily restricted due to multiple failed attempts. Please try again shortly.';
      } else if (err.message) {
        message = err.message;
      }
      return { success: false, error: message };
    }
  }

  // If Firebase Auth is not configured, direct the user to password unlock
  return {
    success: false,
    error: 'Please use the Master Password to unlock the Admin CMS.',
  };
}

export async function logoutUser(): Promise<void> {
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error('Sign out error:', e);
    }
  }
  lockAdminSession();
}

export function subscribeToAuth(callback: (state: AuthState) => void): () => void {
  // Purge any legacy persistent localStorage auth on initialization to prevent auto-login
  try {
    localStorage.removeItem(STORAGE_KEYS.DEMO_AUTH);
  } catch {
    // ignore
  }

  const checkStatus = () => {
    // Admin access strictly requires an active session unlock via Master Password
    const isUnlocked = sessionStorage.getItem('tanbyr_admin_session_unlocked') === 'true';

    callback({
      user: auth?.currentUser || null,
      isAdmin: isUnlocked,
      loading: false,
      isDemoAuth: isUnlocked,
    });
  };

  if (auth) {
    const unsubscribe = onAuthStateChanged(auth, () => {
      checkStatus();
    });

    const handleCustomEvent = () => {
      checkStatus();
    };
    window.addEventListener('tanbyr_auth_changed', handleCustomEvent);

    return () => {
      unsubscribe();
      window.removeEventListener('tanbyr_auth_changed', handleCustomEvent);
    };
  }

  const handleCustomEvent = () => {
    checkStatus();
  };
  window.addEventListener('tanbyr_auth_changed', handleCustomEvent);
  checkStatus();

  return () => {
    window.removeEventListener('tanbyr_auth_changed', handleCustomEvent);
  };
}
