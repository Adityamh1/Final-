import { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing } from '../types';

interface AICleanupModalProps {
  onClose: () => void;
  listings: Listing[];
  onDeleteListing: (id: string) => Promise<void>;
  isAdmin: boolean;
}

interface CleanupRecommendation {
  id: string;
  breed: string;
  reason: string;
  category: string;
  district: string;
  price: number;
  daysOld?: number;
}

export default function AICleanupModal({ onClose, listings, onDeleteListing, isAdmin }: AICleanupModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [summary, setSummary] = useState('');
  const [recommendations, setRecommendations] = useState<CleanupRecommendation[]>([]);
  const [marketTips, setMarketTips] = useState<string[]>([]);
  const [hasOldAds, setHasOldAds] = useState(false);
  const [error, setError] = useState('');
  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [purgedCount, setPurgedCount] = useState(0);

  // Filter listings before analysis to show the user what will be scanned
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  
  // Active user identity for filtering if not admin
  const myDeviceId = localStorage.getItem('pashu_device_id');
  
  const targetListings = listings.filter((item) => {
    // Exclude pre-seeded list if not admin (though seed listings are client-side only anyway)
    const isUserCreated = item.deviceId || item.isLocal === true || !item.id.startsWith('seed-');
    if (!isUserCreated) return false;

    if (isAdmin) {
      return true;
    } else {
      // Regular user can only clean up their own ads
      return (item.deviceId && item.deviceId === myDeviceId) || item.isLocal === true;
    }
  });

  const staleListings = targetListings.filter((item) => {
    const timestamp = item.createdAtTime;
    return timestamp && timestamp < thirtyDaysAgo;
  });

  const handleRunAICleanup = async () => {
    setIsAnalyzing(true);
    setError('');
    try {
      const response = await fetch('/api/ai-cleanup-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listings: targetListings }),
      });

      if (!response.ok) {
        throw new Error('AI Cleanup Analysis failed on the server.');
      }

      const data = await response.json();
      setHasOldAds(data.hasOldAds);
      setSummary(data.summary);
      setRecommendations(data.recommendations || []);
      setMarketTips(data.marketTips || []);
      setHasRun(true);
    } catch (err: any) {
      console.error(err);
      setError('AI विश्लेषण लोड करताना त्रुटी आली. कृपया नंतर पुन्हा प्रयत्न करा.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePurgeListings = async () => {
    if (recommendations.length === 0) return;
    setIsPurging(true);
    setError('');
    try {
      let count = 0;
      for (const rec of recommendations) {
        await onDeleteListing(rec.id);
        count++;
      }
      setPurgedCount(count);
      setPurgeSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError('काही जाहिराती हटवताना समस्या आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsPurging(false);
    }
  };

  // Run automatically when modal mounts to give immediate value
  useEffect(() => {
    handleRunAICleanup();
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-5 flex justify-between items-center text-white shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-amber-200 fill-amber-200" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold font-sans leading-tight">
                  {isAdmin ? '🛡️ AI जाहिरात स्वच्छक (Platform Cleanup)' : '✨ AI जाहिरात स्वच्छक (AI Clean Ads)'}
                </h2>
                <p className="text-[11px] text-amber-100 font-medium">३० दिवसांपेक्षा जास्त जुन्या जाहिरातींचे स्मार्ट व्यवस्थापन</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-amber-800/50 p-2 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            
            {/* Loading / Analyzing State */}
            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-lg">AI विश्लेषण सुरू आहे...</h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                    तुमच्या पशू बाजारातील ३० दिवसांपेक्षा जुन्या जाहिराती शोधून त्यांचे विश्लेषण केले जात आहे. कृपया काही सेकंद थांबा.
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isAnalyzing && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-900 text-sm">त्रुटी आढळली</h4>
                  <p className="text-rose-700 text-xs mt-1">{error}</p>
                  <button
                    onClick={handleRunAICleanup}
                    className="mt-2 text-xs font-bold text-rose-900 underline hover:text-rose-950 cursor-pointer"
                  >
                    पुन्हा प्रयत्न करा (Retry)
                  </button>
                </div>
              </div>
            )}

            {/* Success Screen after Purging */}
            {purgeSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border-2 border-emerald-100">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">यशस्वी मोहीम (Success)</span>
                  <h3 className="font-extrabold text-slate-900 text-xl">जुन्या जाहिराती यशस्वीरित्या हटवल्या!</h3>
                  <p className="text-slate-600 font-bold font-mono text-lg mt-1">
                    {purgedCount} जाहिराती हटवण्यात आल्या आहेत
                  </p>
                </div>

                <div className="bg-emerald-50/50 rounded-2xl p-4 text-xs sm:text-sm text-emerald-800 max-w-lg mx-auto leading-relaxed border border-emerald-100">
                  तुमचा पशू बाजार आता एकदम नवीन आणि अपडेटेड आहे! यामुळे खरेदीदारांना अचूक आणि ताजे पर्याय पाहायला मिळतील, ज्यामुळे तुमच्या इतर जाहिरातींना चांगला प्रतिसाद मिळेल.
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full max-w-xs mx-auto bg-slate-950 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-2xl text-sm transition-all shadow-md cursor-pointer"
                >
                  बंद करा (Close)
                </button>
              </motion.div>
            )}

            {/* Main AI Results Panel */}
            {hasRun && !isAnalyzing && !purgeSuccess && (
              <div className="space-y-5">
                
                {/* AI Summary Banner */}
                <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                  <div className="absolute right-3 top-3 opacity-10">
                    <Sparkles className="w-16 h-16 text-amber-600" />
                  </div>
                  <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 fill-amber-500 text-amber-500" />
                    AI बाजारातील विश्लेषण आणि सल्ला
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {summary}
                  </p>
                </div>

                {/* Stale Ads List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {isAdmin ? `हटवण्यासाठी सुचवलेल्या सर्व जाहिराती (${recommendations.length})` : `माझ्या ३० दिवसांपेक्षा जुन्या जाहिराती (${recommendations.length})`}
                    </h4>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                      वय {'>'} ३० दिवस
                    </span>
                  </div>

                  {recommendations.length > 0 ? (
                    <div className="border border-slate-100 rounded-2xl divide-y divide-slate-100 overflow-hidden bg-slate-50/50 max-h-60 overflow-y-auto">
                      {recommendations.map((rec) => (
                        <div key={rec.id} className="p-3.5 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50/30 transition-colors">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                                {rec.category === 'cow' ? '🐄 गाय' : rec.category === 'buffalo' ? '🐃 म्हैस' : rec.category === 'dog' ? '🐕 कुत्रा' : '🐾 पशु'}
                              </span>
                              <span className="font-extrabold text-slate-900 text-sm">{rec.breed}</span>
                              <span className="text-xs text-slate-400 font-mono">({rec.district})</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 font-medium italic">
                              💡 AI: {rec.reason}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-extrabold text-slate-900 font-mono">₹{rec.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/20">
                      <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">३० दिवसांपेक्षा जास्त जुनी कोणतीही जाहिरात सापडली नाही!</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">तुमचा प्रोफाइल डेटा पूर्णपणे अपडेटेड आहे.</p>
                    </div>
                  )}
                </div>

                {/* Sell Fast Tips */}
                {marketTips.length > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      लवकर विक्री करण्यासाठी AI कडून टिप्स:
                    </h4>
                    <ul className="space-y-2">
                      {marketTips.map((tip, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                          <span className="text-amber-600 font-bold font-mono shrink-0 mt-0.5">{idx + 1}.</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    तसेच ठेवा (Keep As Is)
                  </button>
                  {recommendations.length > 0 && (
                    <button
                      type="button"
                      disabled={isPurging}
                      onClick={handlePurgeListings}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isPurging ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          जाहिराती हटवत आहे...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          {isAdmin ? `✨ सुचवलेल्या सर्व ${recommendations.length} जाहिराती नष्ट करा (AI Cleanup)` : `✨ सुचवलेल्या ${recommendations.length} जुन्या जाहिराती नष्ट करा`}
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
