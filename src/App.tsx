import { useState, useEffect } from 'react';
import { PlusCircle, Search, MapPin, Grid, Heart, Shield, Sparkles, MessageCircle, AlertCircle, ShoppingBag, Trash2, LogOut, Lock, User, TrendingUp, Settings, Activity, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing, FilterOptions, AnimalCategory } from './types';
import { SEED_LISTINGS, MAHARASHTRA_DISTRICTS, getRegionForDistrict, getNearbyDistricts } from './data';
import ListingCard from './components/ListingCard';
import ListingDetailModal from './components/ListingDetailModal';
import AddListingModal from './components/AddListingModal';
import DonateModal from './components/DonateModal';
import DownloadModal from './components/DownloadModal';
import AdSenseSettingsModal from './components/AdSenseSettingsModal';
import AdSenseBanner from './components/AdSenseBanner';
import DeployModal from './components/DeployModal';
import HomeView from './components/HomeView';
import AICleanupModal from './components/AICleanupModal';
import AdminAuthModal from './components/AdminAuthModal';

// Firebase Integrations
import { db, auth, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';

export default function App() {
  // Initialize device ID for identifying owned listings across browser sessions
  useEffect(() => {
    let devId = localStorage.getItem('pashu_device_id');
    if (!devId) {
      devId = 'dev-' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('pashu_device_id', devId);
    }
  }, []);

  // Load real-time listings from Firestore
  const [firestoreListings, setFirestoreListings] = useState<Listing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [localListings, setLocalListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem('pashu_local_listings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAtTime', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Listing[] = [];
      snapshot.forEach((snapDoc) => {
        docs.push({ id: snapDoc.id, ...snapDoc.data() } as Listing);
      });
      setFirestoreListings(docs);
      setIsLoadingListings(false);
    }, (error) => {
      console.warn('Firestore real-time subscription inactive or failed. Operating in local-first mode.', error);
      setIsLoadingListings(false);
      handleFirestoreError(error, OperationType.GET, 'listings');
    });

    return () => unsubscribe();
  }, []);

  // Combine local, pre-seeded, and Firestore listings
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const combined = [...localListings, ...firestoreListings, ...SEED_LISTINGS];
    const uniqueMap = new Map<string, Listing>();
    combined.forEach((item) => {
      if (item && item.id) {
        uniqueMap.set(item.id, item);
      }
    });
    setListings(Array.from(uniqueMap.values()));
  }, [firestoreListings, localListings]);

  // Selected animal detail modal
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Add listing modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Donate and Download modal states
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isAdSenseModalOpen, setIsAdSenseModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isAICleanupOpen, setIsAICleanupOpen] = useState(false);
  const [adsenseKey, setAdsenseKey] = useState(0);

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pashu_admin_local_session') === 'true' || localStorage.getItem('pashu_admin') === 'true';
    } catch {
      return false;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Monitor Auth state dynamically to set Admin permissions securely
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isLocalSession = localStorage.getItem('pashu_admin_local_session') === 'true';
      if ((user && user.email === 'akmhetre09@gmail.com') || isLocalSession) {
        setIsAdmin(true);
        localStorage.setItem('pashu_admin', 'true');
      } else {
        setIsAdmin(false);
        localStorage.removeItem('pashu_admin');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('pashu_admin_local_session');
      localStorage.removeItem('pashu_admin');
      setIsAdmin(false);
      await signOut(auth);
      // fallback to anonymous login so firebase calls continue to work seamlessly
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Active view tab ('home' | 'all' | 'cow' | 'buffalo' | 'dog' | 'my-ads')
  const [activeTab, setActiveTab] = useState<string>('home');

  // Filters State
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [homeDistrict, setHomeDistrict] = useState<string>(() => {
    try {
      return localStorage.getItem('pashu_home_district') || '';
    } catch {
      return '';
    }
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest'); // 'newest' | 'price-asc' | 'price-desc'

  // Notification Banner
  const [showNotification, setShowNotification] = useState(true);

  // Handlers
  const handleAddListing = async (newListing: Listing) => {
    const deviceId = auth.currentUser?.uid || localStorage.getItem('pashu_device_id') || 'anon';
    const listingToSave = {
      ...newListing,
      deviceId,
    };

    // Store listing locally first for immediate responsiveness and offline persistence
    const updatedLocal = [listingToSave, ...localListings];
    setLocalListings(updatedLocal);
    localStorage.setItem('pashu_local_listings', JSON.stringify(updatedLocal));

    try {
      await setDoc(doc(db, 'listings', newListing.id), {
        category: listingToSave.category,
        breed: listingToSave.breed,
        price: listingToSave.price,
        age: listingToSave.age,
        location: listingToSave.location,
        district: listingToSave.district,
        photo: listingToSave.photo,
        sellerName: listingToSave.sellerName,
        phone: listingToSave.phone,
        details: listingToSave.details,
        createdAt: listingToSave.createdAt,
        createdAtTime: listingToSave.createdAtTime,
        hidePhone: listingToSave.hidePhone || false,
        isPremium: listingToSave.isPremium || false,
        deviceId: listingToSave.deviceId,
        ...(listingToSave.milkCapacity ? { milkCapacity: listingToSave.milkCapacity } : {}),
        ...(listingToSave.gender ? { gender: listingToSave.gender } : {})
      });
    } catch (error) {
      console.warn('Could not save to remote Firestore. Running in local-first fallback mode.', error);
      handleFirestoreError(error, OperationType.CREATE, `listings/${newListing.id}`);
    }

    // Scroll to the top of listings
    const element = document.getElementById('listings-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteListing = async (id: string) => {
    // Delete listing from local storage
    const updatedLocal = localListings.filter(item => item.id !== id);
    setLocalListings(updatedLocal);
    localStorage.setItem('pashu_local_listings', JSON.stringify(updatedLocal));

    try {
      await deleteDoc(doc(db, 'listings', id));
    } catch (error) {
      console.warn('Could not delete from remote Firestore. Running in local-first fallback mode.', error);
      handleFirestoreError(error, OperationType.DELETE, `listings/${id}`);
    }
  };

  // Filter and sort listings
  const filteredListings = listings
    .filter((item) => {
      // 1. Tab / Category Filter
      if (activeTab === 'my-ads') {
        const myUid = auth.currentUser?.uid;
        const myDeviceId = localStorage.getItem('pashu_device_id');
        return (item.deviceId && (item.deviceId === myUid || item.deviceId === myDeviceId)) || item.isLocal === true;
      }
      if (activeTab === 'nearby') {
        // If nearby mode, filter by home district or its region
        if (homeDistrict) {
          const regionNeighbors = getNearbyDistricts(homeDistrict);
          const isNearby = item.district === homeDistrict || regionNeighbors.includes(item.district);
          if (!isNearby) return false;
        }
      } else if (activeTab !== 'all' && item.category !== activeTab) {
        return false;
      }

      // 2. District Filter
      if (districtFilter !== 'all' && item.district !== districtFilter) {
        return false;
      }

      // 3. Search Query (Breed, location, seller name, details)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          item.breed.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.district.toLowerCase().includes(query) ||
          item.sellerName.toLowerCase().includes(query) ||
          item.details.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // 1. Premium listings ALWAYS go first
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;

      // 1.5. If in nearby mode, exact home district listings come first
      if (activeTab === 'nearby' && homeDistrict) {
        const isAInHome = a.district === homeDistrict;
        const isBInHome = b.district === homeDistrict;
        if (isAInHome && !isBInHome) return -1;
        if (!isAInHome && isBInHome) return 1;
      }

      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      
      // Newest owned first (My listings first, then default seed sorting)
      const isMyAdA = a.isLocal || (a.deviceId && a.deviceId === localStorage.getItem('pashu_device_id'));
      const isMyAdB = b.isLocal || (b.deviceId && b.deviceId === localStorage.getItem('pashu_device_id'));
      if (isMyAdA && !isMyAdB) return -1;
      if (!isMyAdA && isMyAdB) return 1;
      
      return b.id.localeCompare(a.id);
    });

  // Get dynamic counts
  const totalCount = listings.length;
  const cowCount = listings.filter((item) => item.category === 'cow').length;
  const buffaloCount = listings.filter((item) => item.category === 'buffalo').length;
  const dogCount = listings.filter((item) => item.category === 'dog').length;
  const henCount = listings.filter((item) => item.category === 'hen').length;
  const eggCount = listings.filter((item) => item.category === 'egg').length;
  const manureCount = listings.filter((item) => item.category === 'manure').length;
  const fodderCount = listings.filter((item) => item.category === 'fodder').length;
  const myAdsCount = listings.filter((item) => {
    const myUid = auth.currentUser?.uid;
    const myDeviceId = localStorage.getItem('pashu_device_id');
    return (item.deviceId && (item.deviceId === myUid || item.deviceId === myDeviceId)) || item.isLocal === true;
  }).length;

  // Calculate published animal counts (cow, buffalo, dog, hen)
  const totalAnimalsCount = listings.filter((item) =>
    ['cow', 'buffalo', 'dog', 'hen'].includes(item.category)
  ).length;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayMs = startOfToday.getTime();
  const todayPublishedAnimalsCount = listings.filter((item) => {
    const isAnimal = ['cow', 'buffalo', 'dog', 'hen'].includes(item.category);
    if (!isAnimal) return false;
    if (item.createdAtTime) {
      return item.createdAtTime >= startOfTodayMs;
    }
    // Fallback: include user's local additions during current session or seed matches for today
    return item.isLocal === true || item.createdAt?.includes('१९ जुलै') || item.createdAt?.includes('19/07') || item.createdAt?.includes('19-07');
  }).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900 pb-16">
      {/* Aditya Mhetre Premium Admin Workspace Bar */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white border-b border-amber-500/20 shadow-lg px-4 py-3 relative z-50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5">
            {/* Aditya's Profile Badge */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-md flex items-center justify-center font-bold text-slate-900">
                  AM
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border border-slate-900 flex items-center justify-center" title="सक्रिय ॲडमिन">
                  <Shield className="w-2.5 h-2.5 text-white fill-white" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-amber-100 tracking-tight flex items-center gap-1.5">
                  आदित्य म्हात्रे (Aditya Mhetre) <span className="bg-amber-500/20 text-amber-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase border border-amber-500/30">मुख्य ॲडमिन (Owner)</span>
                </h4>
                <p className="text-[10px] text-slate-300 font-medium">
                  सुरक्षित नियंत्रण कक्ष • Active Session
                </p>
              </div>
            </div>

            {/* Dynamic Stats & Quick Tools */}
            <div className="flex items-center gap-3.5 flex-wrap w-full md:w-auto justify-between md:justify-end">
              {/* Today's Published Animal Ads Widget */}
              <div className="bg-white/10 backdrop-blur-xs rounded-xl px-4 py-1.5 border border-white/10 flex items-center gap-2.5 shadow-inner">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider block leading-none">आजच्या पशू जाहिराती (Today's Animal Ads)</span>
                  <span className="text-sm font-extrabold text-amber-300 font-mono">{todayPublishedAnimalsCount} <span className="text-[10px] text-slate-300 font-medium">(एकूण: {totalAnimalsCount})</span></span>
                </div>
              </div>

              {/* Consolidated Admin Actions directly in the bar */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsAICleanupOpen(true)}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold py-1.5 px-3 rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                  title="ॲपमधील कचरा आणि चुकीच्या जाहिराती काढा"
                >
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  <span>AI स्वच्छक</span>
                </button>
                <button
                  onClick={() => setIsAdSenseModalOpen(true)}
                  className="bg-white/15 hover:bg-white/25 text-slate-100 font-bold py-1.5 px-3 rounded-lg text-xs transition-all flex items-center gap-1 border border-white/10 cursor-pointer"
                  title="जाहिराती टाका किंवा बंद करा"
                >
                  <Settings className="w-3 h-3 text-amber-400" />
                  <span>ॲडसेन्स</span>
                </button>
                <button
                  onClick={() => setIsDeployModalOpen(true)}
                  className="bg-white/15 hover:bg-white/25 text-slate-100 font-bold py-1.5 px-3 rounded-lg text-xs transition-all flex items-center gap-1 border border-white/10 cursor-pointer"
                  title="बदल प्रसिद्ध करा"
                >
                  <span>प्रसिद्ध करा</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/20 hover:bg-red-500/35 text-red-300 font-bold py-1.5 px-3 rounded-lg text-xs transition-all flex items-center gap-1.5 border border-red-500/30 cursor-pointer"
                  title="लॉगआउट करा"
                >
                  <LogOut className="w-3 h-3" />
                  <span>लॉगआउट</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. Header Banner with Local context */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/80 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-600/10 shrink-0">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
                  महाराष्ट्र पशू बाजार
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  थेट खरेदी
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                गाय, म्हैस, कुत्रा, कोंबडी, अंडी, शेणखत आणि मका चारा खरेदी-विक्रीचे सोपे व्यासपीठ (No Sign Up)
              </p>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="flex-1 sm:flex-none bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold py-2 px-3 sm:px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1 border border-amber-200 cursor-pointer"
            >
              📲 अॅप डाउनलोड
            </button>
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="flex-1 sm:flex-none bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2 px-3 sm:px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1 border border-rose-100 cursor-pointer"
            >
              ❤️ मदत करा
            </button>
            {!isAdmin ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 sm:px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-300 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>ॲडमीन लॉगिन (Admin)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <div className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold py-2 px-3 sm:px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-xs shrink-0">
                  <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>आदित्य म्हात्रे (ॲडमीन)</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold py-2 px-3 sm:px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                  title="लॉगआउट करा"
                >
                  <LogOut className="w-4 h-4 text-red-500 shrink-0" />
                  <span>लॉग आउट</span>
                </button>
              </div>
            )}
            <button
              onClick={() => setIsAddModalOpen(true)}
              id="header-add-ad-btn"
              className="flex-2 sm:flex-none bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              जाहिरात टाका
            </button>
          </div>
        </div>

        {/* Persistent Sub-Header Navigation Row */}
        <div className="border-t border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">नेव्हिगेशन:</span>
            {[
              { id: 'home', label: '🏠 मुख्य पान (Home)' },
              { id: 'all', label: '✨ सर्व जाहिराती (All Ads)' },
              { id: 'nearby', label: '📍 जवळचे पशु (Nearby)' },
              { id: 'cow', label: '🐄 गाय (Cow)' },
              { id: 'buffalo', label: '🐃 म्हैस (Buffalo)' },
              { id: 'dog', label: '🐕 कुत्रा (Dog)' },
              { id: 'hen', label: '🐓 कोंबडी' },
              { id: 'my-ads', label: `⭐ माझ्या जाहिराती (${myAdsCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  // If switching from some category, scroll to listing area smoothly
                  if (tab.id !== 'home') {
                    setTimeout(() => {
                      const element = document.getElementById('listings-container');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                  activeTab === tab.id
                    ? 'bg-amber-600 border-amber-600 text-white shadow-sm font-extrabold'
                    : 'bg-white border-slate-200 hover:border-amber-600/30 text-slate-700 hover:bg-amber-50/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Top Informational Notice */}
      {showNotification && (
        <div className="bg-amber-500 text-amber-950 px-4 py-3 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 relative">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>
            <strong>कोणतेही रजिस्ट्रेशन आवश्यक नाही!</strong> विनामूल्य जाहिरात टाका, फोटो पेस्ट करा आणि थेट ग्राहकांशी संपर्क साधा.
          </span>
          <button
            onClick={() => setShowNotification(false)}
            className="absolute right-3 hover:bg-amber-600/30 p-1 rounded-full transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Main Container */}
      <main className="max-w-7xl mx-auto px-4 mt-6 sm:mt-8 space-y-6">

        {/* Header AdSense Ad Placement */}
        <AdSenseBanner 
          key={`header-ad-${adsenseKey}`}
          placement="header" 
          onConfigureClick={() => setIsAdSenseModalOpen(true)} 
          isAdmin={isAdmin}
        />
        
        {/* Statistics Widgets */}
        <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'एकूण उपलब्ध', count: totalCount, color: 'text-slate-800 bg-white border-slate-100' },
            { label: '🐄 गायी (Cows)', count: cowCount, color: 'text-emerald-700 bg-emerald-50/50 border-emerald-100' },
            { label: '🐃 म्हशी (Buffaloes)', count: buffaloCount, color: 'text-amber-800 bg-amber-50/50 border-amber-100/60' },
            { label: '🐕 कुत्रे (Dogs)', count: dogCount, color: 'text-sky-700 bg-sky-50/50 border-sky-100' },
            { label: '🐓 कोंबड्या (Hens)', count: henCount, color: 'text-red-700 bg-red-50/50 border-red-100' },
            { label: '🥚 अंडी (Eggs)', count: eggCount, color: 'text-orange-800 bg-orange-50/50 border-orange-100' },
            { label: '💩 शेणखत (Manure)', count: manureCount, color: 'text-amber-950 bg-amber-100/40 border-amber-200' },
            { label: '🌾 मका चारा (Fodder)', count: fodderCount, color: 'text-green-800 bg-green-50/40 border-green-200' }
          ].map((stat, idx) => (
            <div key={idx} className={`p-3 rounded-xl border shadow-2xs flex flex-col justify-between ${stat.color}`}>
              <span className="text-[11px] sm:text-xs font-bold leading-tight">{stat.label}</span>
              <span className="text-xl sm:text-2xl font-extrabold font-mono mt-1">{stat.count}</span>
            </div>
          ))}
        </section>

        {/* 4. Controls Section: Search, District & Sort */}
        <section className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs space-y-4">
          {activeTab !== 'home' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Search Input */}
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="प्राण्याची जात, तालुका किंवा विक्रेत्याचे नाव शोधा..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-600 transition-all"
                />
              </div>

              {/* District Filter Dropdown */}
              <div className="md:col-span-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-600 transition-all cursor-pointer"
                >
                  <option value="all">सर्व जिल्हे (All Maharashtra Districts)</option>
                  {MAHARASHTRA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      📍 {dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Sort Filter */}
              <div className="md:col-span-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-600 transition-all cursor-pointer"
                >
                  <option value="newest">नवीन जाहिराती आधी (Newest First)</option>
                  <option value="price-asc">किंमत: कमी ते जास्त (Price: Low to High)</option>
                  <option value="price-desc">किंमत: जास्त ते कमी (Price: High to Low)</option>
                </select>
              </div>

            </div>
          )}

          {/* Active Category Tabs */}
          <div className={`flex flex-wrap items-center gap-2 ${activeTab === 'home' ? '' : 'pt-2 border-t border-gray-50'}`}>
            <span className="text-xs font-bold text-gray-500 uppercase mr-1">विभाग (Navigation):</span>
            
            {[
              { id: 'home', label: '🏠 मुख्य पृष्ठ (Home)' },
              { id: 'all', label: 'सर्व पशू-प्राणी व साहित्य' },
              { id: 'nearby', label: '📍 आपल्या जवळचे (Nearby)' },
              { id: 'cow', label: '🐄 गाय (Cow)' },
              { id: 'buffalo', label: '🐃 म्हैस (Buffalo)' },
              { id: 'dog', label: '🐕 कुत्रा (Dog)' },
              { id: 'hen', label: '🐓 कोंबडी (Hen)' },
              { id: 'egg', label: '🥚 अंडी (Egg)' },
              { id: 'manure', label: '💩 शेणखत (Manure)' },
              { id: 'fodder', label: '🌾 मका चारा (Fodder)' },
              { id: 'my-ads', label: `⭐ माझ्या जाहिराती (${myAdsCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* 5. Listings Grid or HomeView */}
        {activeTab === 'home' ? (
          <HomeView
            onSelectCategory={(categoryId) => {
              setActiveTab(categoryId);
              // Scroll to listing container if appropriate
              setTimeout(() => {
                const element = document.getElementById('listings-container');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            counts={{
              total: totalCount,
              cow: cowCount,
              buffalo: buffaloCount,
              dog: dogCount,
              hen: henCount,
              egg: eggCount,
              manure: manureCount,
              fodder: fodderCount,
              myAds: myAdsCount
            }}
            onConfigureClick={() => setIsAdSenseModalOpen(true)}
            isAdmin={isAdmin}
          />
        ) : (
          <div id="listings-container" className="space-y-4">
            {activeTab === 'nearby' && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 border border-amber-100 rounded-3xl p-5 sm:p-6 shadow-sm mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-600/10 text-amber-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800">
                        📍 आपल्या जवळचे पशू शोधा (Animals Near You)
                      </h3>
                      {homeDistrict ? (
                        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                          सध्याचा जिल्हा: <strong className="text-amber-700">{homeDistrict}</strong> (विभाग: {getRegionForDistrict(homeDistrict)})
                        </p>
                      ) : (
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                          तुमचा जिल्हा निवडा, जेणेकरून आम्ही तुमच्या जवळील खरेदी-विक्री जाहिराती दाखवू शकू.
                        </p>
                      )}
                    </div>
                  </div>

                  {homeDistrict && (
                    <button
                      onClick={() => {
                        setHomeDistrict('');
                        localStorage.removeItem('pashu_home_district');
                      }}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-1.5 px-3 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-2xs hover:shadow-xs"
                    >
                      🔄 जिल्हा बदला (Change District)
                    </button>
                  )}
                </div>

                {!homeDistrict ? (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-2">तुमचा जिल्हा निवडा (Select District):</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                      <select
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            setHomeDistrict(val);
                            localStorage.setItem('pashu_home_district', val);
                          }
                        }}
                        defaultValue=""
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all cursor-pointer"
                      >
                        <option value="" disabled>--- जिल्हा निवडा ---</option>
                        {MAHARASHTRA_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>
                            📍 {dist}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          setHomeDistrict('पुणे');
                          localStorage.setItem('pashu_home_district', 'पुणे');
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        पुणे जिल्हा निवडा (Default Pune)
                      </button>
                    </div>

                    <div className="mt-4">
                      <p className="text-[11px] font-bold text-slate-500 uppercase mb-2">लोकप्रिय जिल्हे (Popular Districts):</p>
                      <div className="flex flex-wrap gap-2">
                        {['पुणे', 'नाशिक', 'अहमदनगर', 'सातारा', 'कोल्हापूर', 'सोलापूर'].map((dist) => (
                          <button
                            key={dist}
                            onClick={() => {
                              setHomeDistrict(dist);
                              localStorage.setItem('pashu_home_district', dist);
                            }}
                            className="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 rounded-lg px-3 py-1.5 text-xs transition-all cursor-pointer"
                          >
                            📍 {dist}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/80 rounded-2xl p-3 sm:p-4 border border-amber-100 text-xs sm:text-sm text-slate-600 space-y-2">
                    <p className="leading-relaxed">
                      आम्ही तुमच्यासाठी <strong>{homeDistrict}</strong> आणि शेजारील जिल्हे <strong>{getNearbyDistricts(homeDistrict).slice(0, 5).join(', ')}...</strong> मधील जाहिराती प्राधान्याने शोधून पहिल्या क्रमांकावर मांडल्या आहेत.
                    </p>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        ✓ १००% अचूक अंतर
                      </span>
                      <span className="bg-sky-50 text-sky-800 border border-sky-100 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        ✓ थेट शेतकरी संपर्क
                      </span>
                      <span className="bg-amber-50 text-amber-800 border border-amber-100 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        ✓ दलाल मुक्त बाजार
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'nearby' && !homeDistrict ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto shadow-xs">
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-4 animate-pulse">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">तुमच्या जवळचे पशु शोधा</h3>
                <p className="text-slate-500 text-xs leading-relaxed max-w-sm mb-4">
                  आपला जिल्हा निवडून 'आपल्या जवळचे पशु' पाहा. यामुळे दलालांना न जाता थेट आपल्या परिसरातील पशू मालकांकडून व्यवहार करता येईल.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Grid className="w-5 h-5 text-amber-600" />
                    {activeTab === 'my-ads' ? 'माझ्या अपलोड केलेल्या जाहिराती' : activeTab === 'nearby' ? `आपल्या जवळचे विक्री योग्य पशु (${homeDistrict})` : 'उपलब्ध विक्रीसाठी प्राणी'}
                    <span className="text-sm font-medium text-slate-500 font-mono">
                      ({filteredListings.length} जाहिराती आढळल्या)
                    </span>
                  </h2>
                </div>

                <AnimatePresence mode="popLayout">
                  {filteredListings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredListings.map((listing, index) => (
                        <div key={listing.id} className="contents">
                          <ListingCard
                            listing={listing}
                            onViewDetails={setSelectedListing}
                            onDeleteListing={handleDeleteListing}
                          />
                          {/* Inject AdSense Banner at position #3 */}
                          {index === 1 && (
                            <AdSenseBanner
                              key={`feed-ad-${adsenseKey}`}
                              placement="feed"
                              onConfigureClick={() => setIsAdSenseModalOpen(true)}
                              isAdmin={isAdmin}
                            />
                          )}
                        </div>
                      ))}
                      {/* If total listings is less than 2, also append an Ad card at the end so they can see the feature! */}
                      {filteredListings.length > 0 && filteredListings.length <= 1 && (
                        <AdSenseBanner
                          key={`feed-ad-end-${adsenseKey}`}
                          placement="feed"
                          onConfigureClick={() => setIsAdSenseModalOpen(true)}
                          isAdmin={isAdmin}
                        />
                      )}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-white rounded-2xl border border-gray-100 p-8 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-xs"
                    >
                      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg mb-2">कोणतीही जाहिरात आढळली नाही!</h3>
                      <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        {activeTab === 'my-ads' 
                          ? 'तुम्ही अद्याप कोणतीही जाहिरात टाकलेली नाही. खालील बटणावर क्लिक करून विनावूल्य पहिली जाहिरात अपलोड करा!'
                          : 'तुमच्या जिल्ह्यात किंवा शेजारील जिल्ह्यात सध्या पशू उपलब्ध नाहीत. तुमच्या भागातील पहिली जाहिरात टाकून सुरुवात करा!'}
                      </p>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <PlusCircle className="w-5 h-5" />
                        पहिली मोफत जाहिरात टाका
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        )}

        {/* Additional Utility Blocks: Download App & Donation */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Download App Card */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="relative">
              <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">मोफत शेतकरी ॲप</span>
              <h3 className="text-xl sm:text-2xl font-extrabold mt-4 mb-2">महाराष्ट्र पशू बाजार मोबाईल ॲप</h3>
              <p className="text-amber-50 text-xs sm:text-sm leading-relaxed mb-6">
                तुमच्या मोबाईलमध्ये आमचे अधिकृत ॲप डाउनलोड करा आणि विना इंटरनेट देखील जुन्या जाहिराती पाहा! नवीन जाहिरातींचे नोटिफिकेशन सर्वात आधी मिळवा.
              </p>
              <ul className="space-y-2 mb-6 text-xs text-amber-100">
                <li className="flex items-center gap-2">✓ थेट कॉल आणि व्हॉट्सॲप मेसेजिंग</li>
                <li className="flex items-center gap-2">✓ झटपट फोटो अपलोड</li>
                <li className="flex items-center gap-2">✓ इंटरनेट वाचवा आणि जलद स्पीड मिळवा</li>
              </ul>
            </div>
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="bg-white hover:bg-amber-50 text-amber-700 font-extrabold py-3 px-6 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full mt-auto cursor-pointer"
            >
              📲 आताच ॲप डाउनलोड करा (Download APK)
            </button>
          </div>

          {/* Support Admin Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-48 h-48 bg-rose-50 rounded-full blur-xl pointer-events-none" />
            <div className="relative">
              <span className="bg-rose-50 text-rose-700 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">ॲडमिनला मदत</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-4 mb-2">मदत आणि योगदान (Donate to Admin)</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                आम्ही शेतकऱ्यांकडून जाहिरात टाकण्यासाठी कोणतेही कमिशन किंवा फी घेत नाही. हे व्यासपीठ पूर्णपणे मोफत ठेवण्यासाठी आणि सर्व्हरचा खर्च चालवण्यासाठी तुमचे छोटे योगदान खूप मोलाचे ठरेल!
              </p>
              <div className="bg-rose-50/50 rounded-2xl p-4 mb-6 border border-rose-100/50">
                <p className="text-xs text-rose-800 leading-relaxed font-semibold">
                  "तुमच्या मदतीमुळे महाराष्ट्रातील लाखो शेतकरी आणि पशुपालकांचे हजारो रुपये दलालांपासून (Brokers) वाचत आहेत."
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 px-6 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full mt-auto cursor-pointer"
            >
              ❤️ योगदान द्या (Support Now)
            </button>
          </div>
        </section>

        {/* 6. Footer Information & Safe Practices Guidance */}
        <footer className="bg-slate-900 text-slate-400 rounded-3xl p-6 sm:p-8 space-y-6 mt-12 border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-bold text-white text-base">महाराष्ट्र पशू बाजार बद्दल</h4>
              <p className="leading-relaxed">
                हे महाराष्ट्रतील शेतकरी आणि पशुपालकांसाठी बनवलेले एक विनामूल्य खरेदी-विक्री व्यासपीठ आहे. येथे मोबाईल नंबर, फोटो आणि किंमत टाकून थेट व्यवहार करता येतो.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-500" />
                सुरक्षित खरेदीचे नियम
              </h4>
              <ul className="space-y-2 list-disc pl-4">
                <li>प्राणी स्वतः प्रत्यक्ष जाऊन खात्रीपूर्वक तपासा.</li>
                <li>दूध देणाऱ्या गाय किंवा म्हशीचे किमान २ वेळा स्वतः दूध काढून पाहा.</li>
                <li>पैसे देण्यापूर्वी लसीकरण आणि तब्येतीची खात्री करा.</li>
                <li>कधीही आगाऊ (Advance) पैसे किंवा टोकन पाठवू नका.</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-500" />
                थेट संपर्क केंद्र
              </h4>
              <p className="leading-relaxed">
                जाहिरात आवडल्यास थेट "कॉल करा" किंवा "व्हॉट्सॲप" बृतीचा वापर करा. यामध्ये कोणताही मध्यस्थ (Broker) किंवा कमिशन नाही.
              </p>
              <div className="pt-2 text-xs text-slate-500 flex flex-wrap items-center gap-2">
                <span>© २०२६ महाराष्ट्र पशू बाजार. शेतकरी हितासाठी समर्पित.</span>
                <span>•</span>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-amber-500 hover:text-amber-400 font-bold underline transition-all cursor-pointer flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  {isAdmin ? '🛡️ ॲडमीन पॅनेल (Logged In)' : '🔒 ॲडमीन लॉगिन (Admin Login)'}
                </button>
              </div>
            </div>
          </div>
        </footer>

      </main>

      {/* Floating post ad button on mobile view */}
      <div className="fixed bottom-6 right-6 z-40 sm:hidden">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold p-4 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          title="जाहिरात टाका"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      </div>

      {/* 7. Modals */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
      />

      {isAddModalOpen && (
        <AddListingModal
          onClose={() => setIsAddModalOpen(false)}
          onAddListing={handleAddListing}
        />
      )}

      {isDonateModalOpen && (
        <DonateModal
          onClose={() => setIsDonateModalOpen(false)}
        />
      )}

      {isDownloadModalOpen && (
        <DownloadModal
          listings={listings}
          onClose={() => setIsDownloadModalOpen(false)}
        />
      )}

      {isAdSenseModalOpen && (
        <AdSenseSettingsModal
          onClose={() => setIsAdSenseModalOpen(false)}
          onSave={() => setAdsenseKey((prev) => prev + 1)}
        />
      )}

      {isDeployModalOpen && (
        <DeployModal
          onClose={() => setIsDeployModalOpen(false)}
        />
      )}

      {isAICleanupOpen && (
        <AICleanupModal
          onClose={() => setIsAICleanupOpen(false)}
          listings={listings}
          onDeleteListing={handleDeleteListing}
          isAdmin={isAdmin}
        />
      )}

      {isAuthModalOpen && (
        <AdminAuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={() => {
            setIsAdmin(true);
            setIsAuthModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
