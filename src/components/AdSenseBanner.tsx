import { useState, useEffect } from 'react';
import { Sparkles, Megaphone, Info, ExternalLink, X } from 'lucide-react';
import { motion } from 'motion/react';

interface AdSenseBannerProps {
  placement: 'header' | 'feed' | 'sidebar';
  onConfigureClick?: () => void;
  isAdmin?: boolean;
}

interface SimulatedAd {
  title: string;
  sponsor: string;
  description: string;
  cta: string;
  image: string;
  link: string;
}

const SIMULATED_ADS: SimulatedAd[] = [
  {
    title: '🥛 कपिला पशू आहार (Kapila Cattle Feed)',
    sponsor: 'कपिला अॅग्रो इंडस्ट्रीज',
    description: 'दुधाची फॅट (FAT) आणि पशूचे आरोग्य वाढवण्यासाठी महाराष्ट्रातील सर्वात लोकप्रिय आणि विश्वासू पशू आहार. आजच जवळच्या डीलरला भेटा!',
    cta: 'नजीकचे केंद्र शोधा',
    image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=400&auto=format&fit=crop&q=80',
    link: 'https://www.google.com'
  },
  {
    title: '🚜 महिंद्रा युव्हो ट्रॅक्टर (Mahindra Tractor)',
    sponsor: 'महिंद्रा ट्रॅक्टर्स महाराष्ट्र',
    description: 'नवीन तंत्रज्ञानाचा ४५ एचपी मजबूत ट्रॅक्टर, जो शेतीच्या प्रत्येक कठीण कामात देईल सर्वोत्तम इंधन बचत आणि जबरदस्त ताकद.',
    cta: 'मोफत टेस्ट ड्राईव्ह बुक करा',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&auto=format&fit=crop&q=80',
    link: 'https://www.google.com'
  },
  {
    title: '🩺 पशुसंवर्धन विभाग मोफत पशू विमा योजना',
    sponsor: 'महाराष्ट्र शासन योजना विभाग',
    description: 'तुमच्या दुभत्या जनावरांचा विमा काढा आणि अकाली अपघातातून आर्थिक नुकसान टाळा. शासनाकडून ७५% पर्यंत सवलत (Subsidy) उपलब्ध.',
    cta: 'योजनेचा अर्ज पाहा',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&auto=format&fit=crop&q=80',
    link: 'https://www.google.com'
  },
  {
    title: '🌾 सेंद्रिय गांडूळ खत व गावरान खते',
    sponsor: 'कृषी अमृत ऑरगॅनिक्स',
    description: 'जमिनीची सुपीकता वाढवून पिकांचे उत्पादन २५ टक्क्यांनी वाढवा. १००% नैसर्गिक आणि सेंद्रिय गांडूळ खत थेट शेतावरून घरपोच उपलब्ध.',
    cta: 'किंमत व ऑर्डर पाहा',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=400&auto=format&fit=crop&q=80',
    link: 'https://www.google.com'
  },
  {
    title: '🔋 सोलर कृषी पंप योजना २०२६ (Solar Pump)',
    sponsor: 'महावितरण सौर ऊर्जा',
    description: 'दिवसा सिंचन करण्यासाठी ९०% सवलतीवर शेतकऱ्यांना सौर कृषी पंप वाटप सुरू झाले आहे. आजच तुमचे नाव नोंदवा आणि लाभ घ्या.',
    cta: 'ऑनलाईन अर्ज करा',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&auto=format&fit=crop&q=80',
    link: 'https://www.google.com'
  }
];

export default function AdSenseBanner({ placement, onConfigureClick, isAdmin: propIsAdmin }: AdSenseBannerProps) {
  const [enabled, setEnabled] = useState(true);
  const [simMode, setSimMode] = useState(true);
  const [publisherId, setPublisherId] = useState('');
  const [slotId, setSlotId] = useState('');
  const [activeAd, setActiveAd] = useState<SimulatedAd | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (propIsAdmin !== undefined) {
      setIsAdmin(propIsAdmin);
    } else if (typeof window !== 'undefined') {
      const isCurrentlyAdmin = window.location.search.includes('admin=true') || localStorage.getItem('pashu_admin') === 'true';
      setIsAdmin(isCurrentlyAdmin);
    }
  }, [propIsAdmin]);

  useEffect(() => {
    // Check local storage configuration
    const checkConfig = () => {
      const savedEnabled = localStorage.getItem('adsense_enabled');
      const savedSimMode = localStorage.getItem('adsense_sim_mode');
      const savedPubId = localStorage.getItem('adsense_publisher_id');
      const savedSlotId = localStorage.getItem('adsense_slot_id');

      setEnabled(savedEnabled === null ? true : savedEnabled === 'true');
      setSimMode(savedSimMode === null ? true : savedSimMode === 'true');
      setPublisherId(savedPubId || 'ca-pub-2256406165784358');
      setSlotId(savedSlotId || '9876543210');
    };

    checkConfig();
    // Add event listener to react to manual settings saves
    window.addEventListener('storage', checkConfig);
    
    // Pick a random ad
    const randomIndex = Math.floor(Math.random() * SIMULATED_ADS.length);
    setActiveAd(SIMULATED_ADS[randomIndex]);

    return () => {
      window.removeEventListener('storage', checkConfig);
    };
  }, []);

  if (!enabled || !isVisible || !activeAd) {
    return null;
  }

  const handleAdClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Navigate to sponsor url in new tab safely
    if (activeAd.link) {
      window.open(activeAd.link, '_blank', 'noopener,noreferrer');
    }
  };

  // Render Real AdSense Tag if simulation mode is off
  if (!simMode && publisherId.startsWith('ca-pub-')) {
    return (
      <div className="w-full bg-white border border-gray-100 rounded-3xl p-3 sm:p-4 text-center shadow-2xs my-4 overflow-hidden">
        <div className="flex items-center justify-between px-2 mb-1.5">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Google Ads (Live integration)</span>
          <span className="text-[10px] text-gray-400 font-mono">Slot: {slotId}</span>
        </div>
        
        {/* Real AdSense HTML Element */}
        <div className="flex justify-center items-center min-h-[90px] bg-slate-50 rounded-xl">
          <ins className="adsbygoogle"
               style={{ display: 'block', width: '100%' }}
               data-ad-client={publisherId}
               data-ad-slot={slotId}
               data-ad-format="auto"
               data-full-width-responsive="true"
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-2">
          Real Google AdSense Tag injected via Client ID <strong className="font-mono text-slate-500">{publisherId}</strong>.
        </p>
      </div>
    );
  }

  // Header Placement (Horizontal Banner)
  if (placement === 'header') {
    return (
      <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-100 rounded-3xl p-3 sm:p-4 shadow-3xs flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6 w-24 h-24 bg-amber-500/5 rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <img
            src={activeAd.image}
            alt="Ad Graphic"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border border-amber-200/50 shrink-0 shadow-2xs"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-0.5">
                <Megaphone className="w-2.5 h-2.5" />
                प्रायोजित (Sponsor)
              </span>
              <span className="text-[11px] font-bold text-slate-400 font-sans">{activeAd.sponsor}</span>
            </div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
              {activeAd.title}
            </h4>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              {activeAd.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            onClick={handleAdClick}
            className="flex-1 sm:flex-none bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold py-2 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {activeAd.cta}
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          
          {onConfigureClick && isAdmin && (
            <button
              onClick={onConfigureClick}
              className="bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-700 text-xs font-bold p-2 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
              title="AdSense Setup"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden md:inline">अॅडसेन्स जोडा</span>
            </button>
          )}

          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100/50 cursor-pointer"
            title="जाहिरात लपवा"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>


      </div>
    );
  }

  // Feed/Card Placement (Fits natively inside the livestock list grid!)
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[360px] hover:border-amber-200 hover:shadow-md transition-all group">
      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
        <span className="bg-amber-100/90 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-xs shadow-3xs flex items-center gap-1">
          <Megaphone className="w-3 h-3 text-amber-700" />
          प्रायोजित जाहिरात
        </span>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2.5 right-2.5 z-10 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full backdrop-blur-xs transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="space-y-4">
        {/* Ad Graphic Banner background */}
        <div className="w-full h-44 rounded-2xl overflow-hidden relative border border-slate-100 shadow-2xs">
          <img
            src={activeAd.image}
            alt={activeAd.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4">
            <span className="text-white text-xs font-bold font-sans drop-shadow-sm">{activeAd.sponsor}</span>
          </div>
        </div>

        {/* Ad Copy text */}
        <div className="space-y-1.5">
          <h4 className="text-sm font-extrabold text-slate-950 group-hover:text-amber-600 transition-colors">
            {activeAd.title}
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            {activeAd.description}
          </p>
        </div>
      </div>

      {/* Action triggers */}
      <div className="pt-4 mt-auto border-t border-slate-50 flex items-center gap-2">
        <button
          onClick={handleAdClick}
          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold py-2.5 px-4 rounded-xl shadow-3xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>{activeAd.cta}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {onConfigureClick && isAdmin && (
          <button
            onClick={onConfigureClick}
            className="bg-slate-50 hover:bg-slate-100 text-slate-600 p-2.5 rounded-xl border border-slate-100 transition-colors cursor-pointer"
            title="AdSense Setup"
          >
            <Info className="w-4 h-4" />
          </button>
        )}
      </div>


    </div>
  );
}
