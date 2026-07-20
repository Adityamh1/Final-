import { useState, useEffect } from 'react';
import { X, Smartphone, ArrowDownToLine, CheckCircle2, Sparkles, MonitorPlay, Share2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DownloadModalProps {
  listings: any[];
  onClose: () => void;
}

export default function DownloadModal({ listings, onClose }: DownloadModalProps) {
  const [downloadProgress, setDownloadProgress] = useState(-1); // -1 means not started
  const [installStep, setInstallStep] = useState(''); // 'downloading', 'installing', 'success'
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Monitor the PWA install event from browser
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle fake download progress and then trigger actual HTML package download
  useEffect(() => {
    if (downloadProgress >= 0 && downloadProgress < 100) {
      const interval = setTimeout(() => {
        setDownloadProgress((prev) => prev + Math.floor(Math.random() * 20) + 10);
      }, 150);
      return () => clearTimeout(interval);
    } else if (downloadProgress >= 100 && installStep === 'downloading') {
      setDownloadProgress(100);
      setInstallStep('installing');
      
      // Trigger the real file download of the Offline-capable HTML application!
      handleDownloadOfflineHtml();

      const timer = setTimeout(() => {
        setInstallStep('success');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [downloadProgress, installStep]);

  const handleStartDownload = async () => {
    // If browser supports PWA installation natively
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setDownloadProgress(100);
        setInstallStep('success');
        return;
      }
    }
    
    // Otherwise fallback to simulated progress bar and real offline-HTML file download
    setDownloadProgress(0);
    setInstallStep('downloading');
  };

  const handleDownloadOfflineHtml = () => {
    const offlineContent = generateOfflineHtml(listings);
    const element = document.createElement("a");
    const file = new Blob([offlineContent], { type: 'text/html;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "PashuBazar_Offline.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadAppZip = () => {
    const element = document.createElement("a");
    element.href = "/pashubazaar_app.zip";
    element.download = "pashubazaar_app.zip";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
          className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-amber-600 px-6 py-5 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-100" />
              <h2 className="text-lg sm:text-xl font-bold font-sans">अॅप डाउनलोड करा (Download App)</h2>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-amber-700/50 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {installStep !== 'success' ? (
              <>
                {/* Intro details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">महाराष्ट्र पशू बाजार ऑफलाईन ॲप</h3>
                      <p className="text-slate-500 text-xs sm:text-sm">ॲप प्रकार: ऑफलाईन चालू असणारी वेब-फाईल | आकार: ८० KB</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    शेतकऱ्यांसाठी खास बनवलेली ही खास ऑफलाईन फाईल आहे.
                  </p>
                </div>

                {/* Features List */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">ॲपचे मुख्य फायदे (App Features):</h4>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-center gap-2">🟢 <strong>१००% ऑफलाईन काम करते:</strong> इंटरनेट बंद असतानाही चालू राहते.</li>
                    <li className="flex items-center gap-2">📞 <strong>थेट संपर्क:</strong> पशू मालकाचा संपर्क नंबर व माहिती एका सेकंदात मिळते.</li>
                    <li className="flex items-center gap-2">📲 <strong>सहज शेअरिंग:</strong> ही फाईल थेट WhatsApp वरून इतर शेतकऱ्यांना पाठवता येते.</li>
                  </ul>
                </div>

                {/* Interactive Simulation Block */}
                {downloadProgress === -1 ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleStartDownload}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                      मोबाईलमध्ये स्थापित करा / डाऊनलोड करा
                    </button>
                    <button
                      onClick={handleDownloadOfflineHtml}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-600" />
                      थेट ऑफलाईन फाईल (HTML) डाऊनलोड करा
                    </button>
                    <button
                      onClick={handleDownloadAppZip}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-800 shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5 text-amber-400" />
                      APK साठी App ZIP फाईल डाऊनलोड करा
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 py-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>
                        {installStep === 'downloading' 
                          ? `ऑफलाईन पॅकेज तयार होत आहे... ${Math.min(downloadProgress, 100)}%` 
                          : 'फाईल डाऊनलोड फोल्डरमध्ये साठवली जात आहे...'}
                      </span>
                      <span className="font-mono">{Math.min(downloadProgress, 100)}%</span>
                    </div>
                    
                    {/* Progress Bar Container */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(downloadProgress, 100)}%` }}
                        className="h-full bg-amber-500 rounded-full"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 text-center">कृपया ही विंडो बंद करू नका, फाईल डाऊनलोड होत आहे...</p>
                  </div>
                )}

                {/* Mobile App APK packaging Guide */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 bg-amber-50 p-2.5 rounded-xl border border-amber-100/60">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    मोबाईल ॲप (.APK) कसे बनवावे? (APK Guide)
                  </h4>
                  <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100/80">
                      <p className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                        <span>🌐 WebintoApp द्वारे (सर्वात सोपे):</span>
                      </p>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-500 text-[11px]">
                        <li>वर दिलेला <strong className="text-slate-700">"APK साठी App ZIP फाईल डाऊनलोड करा"</strong> पर्याय निवडून <code>pashubazaar_app.zip</code> फाईल डाऊनलोड करा.</li>
                        <li><a href="https://www.webintoapp.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 font-bold underline hover:text-amber-700">WebintoApp.com</a> वर जा.</li>
                        <li>तिथे <strong>"Upload ZIP"</strong> पर्याय निवडून डाऊनलोड केलेली <code>pashubazaar_app.zip</code> फाईल अपलोड करा.</li>
                        <li>ॲपचे नाव <strong>"Maharashtra Pashu Bazar"</strong> द्या आणि <strong>"Convert to APK"</strong> करा. कोणतेही काम सोपे होईल!</li>
                      </ol>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100/80">
                      <p className="font-bold text-slate-800 mb-1">💻 Capacitor व Android Studio द्वारे (Local Build):</p>
                      <p className="mb-1 text-[11px] text-slate-500">या प्रोजेक्टमध्ये आधीच Capacitor जोडलेले आहे. कॉम्प्युटरवर पुढील कमांड्स रन करा:</p>
                      <pre className="bg-slate-900 text-slate-200 p-2.5 rounded-lg text-[10px] font-mono overflow-x-auto space-y-0.5">
                        <div>npm install</div>
                        <div>npm run build</div>
                        <div>npx cap sync</div>
                        <div>npx cap open android</div>
                      </pre>
                      <p className="mt-1 text-[11px] text-slate-500">Android Studio मध्ये <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong> निवडून मूळ APK तयार करा.</p>
                    </div>
                  </div>
                </div>

                {/* Standard PWA Guide */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MonitorPlay className="w-4 h-4 text-slate-400" />
                    होम स्क्रीनवर जोडण्याची अधिकृत पद्धत (Install PWA)
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80">
                      <p className="font-bold text-slate-800 mb-1">🤖 अँड्रॉइड युजर्स:</p>
                      <p>१. ब्राउझरच्या वरील कोपऱ्यातील तीन ठिपक्यांवर <strong>(⋮)</strong> क्लिक करा.</p>
                      <p className="mt-0.5">२. <strong>"Add to Home Screen"</strong> किंवा <strong>"Install App"</strong> निवडा.</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80">
                      <p className="font-bold text-slate-800 mb-1">🍎 आयफोन युजर्स:</p>
                      <p>१. सफारी ब्राउझरमधील खालील <strong>"Share"</strong> चिन्हावर दाबा.</p>
                      <p className="mt-0.5">२. खाली स्क्रोल करून <strong>"Add to Home Screen"</strong> निवडा.</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Success Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border-2 border-emerald-100">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">यशस्वी (Successful!)</span>
                  <h3 className="font-extrabold text-slate-900 text-xl">ऑफलाईन ॲप डाऊनलोड झाले!</h3>
                </div>

                <div className="bg-amber-50 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 max-w-xs mx-auto leading-relaxed border border-amber-100">
                  <p className="font-bold mb-1 flex items-center justify-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-600 fill-amber-600 animate-pulse" />
                    PashuBazar_Offline.html
                  </p>
                  तुमच्या मोबाईलच्या 'Downloads' फोल्डरमध्ये ऑफलाईन ॲप फाईल डाऊनलोड झाली आहे! तुम्ही ही फाईल इंटरनेटशिवाय कधीही उघडू शकता आणि इतर शेतकऱ्यांना WhatsApp वर पाठवू शकता.
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadOfflineHtml}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> पुनः डाऊनलोड
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-slate-950 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer"
                  >
                    बंद करा (Close)
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// standalone offline html web app generator function
const generateOfflineHtml = (listings: any[]) => {
  const listingsJson = JSON.stringify(listings, null, 2);
  return `<!doctype html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>महाराष्ट्र पशू बाजार - ऑफलाईन आवृत्ती</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    body {
      font-family: 'Inter', sans-serif;
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen">
  <!-- Header -->
  <header class="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
    <div class="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🐂</span>
        <div>
          <h1 class="text-lg font-extrabold text-amber-500">महाराष्ट्र पशू बाजार</h1>
          <p class="text-[10px] text-slate-300">१००% ऑफलाईन आवृत्ती (विना इंटरनेट काम करते)</p>
        </div>
      </div>
      <div class="bg-amber-600/20 text-amber-400 border border-amber-500/30 text-xs font-bold py-1 px-3 rounded-full">
        🟢 ऑफलाईन डेटा लोड झाला
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-6 space-y-6">
    <!-- Notice -->
    <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3 text-xs sm:text-sm text-blue-900">
      <span class="text-xl shrink-0">ℹ️</span>
      <div>
        <strong>ऑफलाईन वापर कसा करावा:</strong> ही फाईल तुमच्या फोनमध्ये सुरक्षित साठवून ठेवा. इंटरनेट नसतानाही तुम्ही सर्व पशूंच्या जाहिराती पाहू शकता आणि थेट फोन कॉल करू शकता!
      </div>
    </div>

    <!-- Search and filter -->
    <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
      <div class="relative">
        <input 
          type="text" 
          id="searchInput" 
          placeholder="गाव, जिल्हा किंवा जात शोधा..." 
          class="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
          oninput="filterListings()"
        >
        <span class="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
      </div>

      <div class="flex flex-wrap gap-1.5" id="tabs">
        <button onclick="selectCategory('all')" id="tab-all" class="category-btn py-1.5 px-3.5 rounded-lg text-xs font-bold bg-amber-600 text-white border border-amber-600 transition-all">सर्व पशू व साहित्य</button>
        <button onclick="selectCategory('cow')" id="tab-cow" class="category-btn py-1.5 px-3.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 transition-all">🐄 गाय</button>
        <button onclick="selectCategory('buffalo')" id="tab-buffalo" class="category-btn py-1.5 px-3.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 transition-all">🐃 म्हैस</button>
        <button onclick="selectCategory('dog')" id="tab-dog" class="category-btn py-1.5 px-3.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 transition-all">🐕 कुत्रा</button>
        <button onclick="selectCategory('hen')" id="tab-hen" class="category-btn py-1.5 px-3.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 transition-all">🐓 कोंबडी</button>
        <button onclick="selectCategory('egg')" id="tab-egg" class="category-btn py-1.5 px-3.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 transition-all">🥚 अंडी</button>
        <button onclick="selectCategory('manure')" id="tab-manure" class="category-btn py-1.5 px-3.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 transition-all">💩 शेणखत</button>
        <button onclick="selectCategory('fodder')" id="tab-fodder" class="category-btn py-1.5 px-3.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 transition-all">🌾 चारा</button>
      </div>
    </div>

    <!-- Listings Grid -->
    <div id="listingsGrid" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Dynamic cards go here -->
    </div>

    <!-- Empty state -->
    <div id="emptyState" class="hidden text-center py-12 space-y-3">
      <span class="text-4xl block">🕵️</span>
      <p class="text-slate-500 font-bold text-sm">या प्रकारात एकही जाहिरात सापडली नाही!</p>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-xs mt-12">
    <p class="font-bold text-slate-300">© महाराष्ट्र पशू बाजार</p>
    <p class="mt-1">हा डेटा शेवटचा डाउनलोड केला: ${new Date().toLocaleDateString('mr-IN')}</p>
  </footer>

  <script>
    // Embedded Data
    const listings = ${listingsJson};

    let selectedCategory = 'all';

    function getCategoryEmoji(cat) {
      switch (cat) {
        case 'cow': return '🐄';
        case 'buffalo': return '🐃';
        case 'dog': return '🐕';
        case 'hen': return '🐓';
        case 'egg': return '🥚';
        case 'manure': return '💩';
        case 'fodder': return '🌾';
        default: return '🐾';
      }
    }

    function getCategoryLabel(cat) {
      switch (cat) {
        case 'cow': return 'गाय (Cow)';
        case 'buffalo': return 'म्हैस (Buffalo)';
        case 'dog': return 'कुत्रा (Dog)';
        case 'hen': return 'कोंबडी (Hen)';
        case 'egg': return 'अंडी (Egg)';
        case 'manure': return 'शेणखत (Manure)';
        case 'fodder': return 'मका चारा (Fodder)';
        default: return 'पशू';
      }
    }

    function renderListings() {
      const grid = document.getElementById('listingsGrid');
      const emptyState = document.getElementById('emptyState');
      const searchVal = document.getElementById('searchInput').value.toLowerCase();

      grid.innerHTML = '';
      let count = 0;

      listings.forEach(item => {
        // Apply filter
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.breed.toLowerCase().includes(searchVal) || 
                              item.location.toLowerCase().includes(searchVal) || 
                              item.district.toLowerCase().includes(searchVal) ||
                              item.sellerName.toLowerCase().includes(searchVal);

        if (matchesCategory && matchesSearch) {
          count++;
          const card = document.createElement('div');
          card.className = "bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xs flex flex-col justify-between";
          
          card.innerHTML = \`
            <div>
              <div class="relative h-48 bg-slate-100">
                <img src="\${item.photo}" alt="\${item.breed}" class="w-full h-full object-cover">
                <span class="absolute top-3 left-3 bg-slate-900/80 text-white backdrop-blur-xs text-[11px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1 border border-white/10">
                  \${getCategoryEmoji(item.category)} \${getCategoryLabel(item.category)}
                </span>
              </div>

              <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-extrabold text-slate-900 text-base leading-tight">\${item.breed}</h3>
                  <span class="text-amber-700 font-extrabold text-base whitespace-nowrap">₹\${item.price}</span>
                </div>

                <div class="flex items-center gap-1 text-slate-500 text-xs mb-3 font-medium">
                  📍 <span>\${item.location}, \${item.district}</span>
                </div>

                <!-- Info Badges -->
                <div class="flex flex-wrap gap-1.5 mb-4">
                  <span class="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                    \${item.category === 'egg' ? 'तपशील' : item.category === 'manure' ? 'विक्री' : item.category === 'fodder' ? 'प्रमाण' : 'वय'}: \${item.age}
                  </span>
                  \${item.milkCapacity ? \`<span class="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md">🥛 \${item.milkCapacity} लि. क्षमता</span>\` : ''}
                </div>

                <p class="text-slate-600 text-xs leading-relaxed line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">\${item.details}</p>
              </div>
            </div>

            <div class="p-5 pt-0">
              <div class="border-t border-slate-100 pt-4 flex flex-col gap-2">
                <div class="flex justify-between items-center text-xs text-slate-500 mb-1">
                  <span class="font-bold text-slate-700">विक्रेते: \${item.sellerName}</span>
                </div>
                <a href="tel:\${item.phone}" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs text-center flex items-center justify-center gap-2 transition-all">
                  📞 थेट फोन करा (\${item.phone})
                </a>
              </div>
            </div>
          \`;
          grid.appendChild(card);
        }
      });

      if (count === 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
      }
    }

    function selectCategory(cat) {
      selectedCategory = cat;
      
      // Update tabs UI
      const buttons = document.querySelectorAll('.category-btn');
      buttons.forEach(btn => {
        btn.className = "category-btn py-1.5 px-3.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 transition-all";
      });

      const activeBtn = document.getElementById('tab-' + cat);
      if (activeBtn) {
        activeBtn.className = "category-btn py-1.5 px-3.5 rounded-lg text-xs font-bold bg-amber-600 text-white border border-amber-600 transition-all shadow-sm";
      }

      renderListings();
    }

    function filterListings() {
      renderListings();
    }

    // Initial render
    renderListings();
  </script>
</body>
</html>`;
};
