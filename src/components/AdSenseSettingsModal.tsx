import { useState, useEffect } from 'react';
import { X, Check, Shield, Info, Copy, Settings, Code, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdSenseSettingsModalProps {
  onClose: () => void;
  onSave: () => void;
}

export default function AdSenseSettingsModal({ onClose, onSave }: AdSenseSettingsModalProps) {
  const [enabled, setEnabled] = useState(true);
  const [publisherId, setPublisherId] = useState('ca-pub-2256406165784358');
  const [slotId, setSlotId] = useState('9876543210');
  const [simMode, setSimMode] = useState(true);
  const [copied, setCopied] = useState(false);

  // Load current configuration
  useEffect(() => {
    const savedEnabled = localStorage.getItem('adsense_enabled');
    const savedPubId = localStorage.getItem('adsense_publisher_id');
    const savedSlotId = localStorage.getItem('adsense_slot_id');
    const savedSimMode = localStorage.getItem('adsense_sim_mode');

    if (savedEnabled !== null) setEnabled(savedEnabled === 'true');
    if (savedPubId !== null) setPublisherId(savedPubId);
    if (savedSlotId !== null) setSlotId(savedSlotId);
    if (savedSimMode !== null) setSimMode(savedSimMode === 'true');
  }, []);

  const handleSave = () => {
    localStorage.setItem('adsense_enabled', String(enabled));
    localStorage.setItem('adsense_publisher_id', publisherId);
    localStorage.setItem('adsense_slot_id', slotId);
    localStorage.setItem('adsense_sim_mode', String(simMode));
    
    // Inject or update real script if enabled and not in sim mode
    if (enabled && !simMode && publisherId.startsWith('ca-pub-')) {
      const existingScript = document.querySelector('script[src*="pagead/js/adsbygoogle.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.body.appendChild(script);
      }
    }

    onSave();
    onClose();
  };

  const adCodeSnippet = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}" crossorigin="anonymous"></script>
<!-- महाराष्ट्र पशू बाजार जाहिरात -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${publisherId}"
     data-ad-slot="${slotId}"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(adCodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 px-6 py-5 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-500 animate-spin-slow" />
              <h2 className="text-lg sm:text-xl font-bold font-sans">गूगल अॅडसेन्स सेटिंग्ज (Google AdSense)</h2>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-slate-800 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {/* Status toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">जाहिराती दाखवा (Show Adsense Banners)</h3>
                <p className="text-xs text-slate-500">ॲपमध्ये जाहिरात जागा आणि बॅनर दाखवणे नियंत्रित करा.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                {/* Simulation Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600 fill-amber-600" />
                      सिम्युलेशन आणि स्थानिक जाहिरात दाखवा (Simulate Ads)
                    </h4>
                    <p className="text-[11px] sm:text-xs text-amber-700">
                      चालू ठेवल्यास शेतकऱ्यांसाठी खास बनवलेल्या सुंदर स्थानिक जाहिराती दिसतील.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={simMode}
                      onChange={(e) => setSimMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>



                {/* Configuration inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">पब्लिशर आयडी (Publisher ID)*</label>
                    <input
                      type="text"
                      placeholder="ca-pub-1234567890123456"
                      value={publisherId}
                      onChange={(e) => setPublisherId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-hidden focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">जाहिरात स्लॉट आयडी (Ad Slot ID)</label>
                    <input
                      type="text"
                      placeholder="9876543210"
                      value={slotId}
                      onChange={(e) => setSlotId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-hidden focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-600"
                    />
                  </div>
                </div>

                {/* Info Alert */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex gap-2 items-start text-xs text-slate-600 leading-relaxed">
                  <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">थेट जोडणी कशी करावी?</p>
                    <p>जर आपण या कोडला निर्यात करून स्वतःच्या डोमेनवर चालवत असाल, तर आपण वरील पब्लिशर आयडी बदलून थेट आपल्या मूळ गुगल ॲडसेन्स खात्याशी कनेक्ट करू शकता.</p>
                  </div>
                </div>

                {/* Code Snippet Box */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Code className="w-4 h-4 text-slate-500" />
                      गुगल ॲडसेन्स एचटीएमएल कोड (Integration Code):
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">कॉपी केला!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>कोड कॉपी करा</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-3 bg-slate-900 text-slate-300 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed max-h-36">
                    {adCodeSnippet}
                  </pre>
                </div>
              </motion.div>
            )}

            {!enabled && (
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">जाहिराती बंद आहेत</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">जाहिराती बंद केल्याने वापरकर्त्यांना फक्त पशूंचे मूळ फीड दिसेल, कोणताही अतिरिक्त बॅनर लोड होणार नाही.</p>
              </div>
            )}
          </div>

          {/* Footer Save buttons */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3 shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              रद्द करा (Cancel)
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              बदल सेव्ह करा (Save)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
