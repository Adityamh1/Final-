import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Mail, Shield, CheckCircle2, Phone, MessageSquare, 
  Send, HelpCircle, ArrowRight, Sparkles, BookOpen, Heart
} from 'lucide-react';
import AdSenseBanner from './AdSenseBanner';

interface HomeViewProps {
  onSelectCategory: (category: string) => void;
  counts: {
    total: number;
    cow: number;
    buffalo: number;
    dog: number;
    hen: number;
    egg: number;
    manure: number;
    fodder: number;
    myAds: number;
  };
  onConfigureClick?: () => void;
  isAdmin?: boolean;
}

export default function HomeView({ onSelectCategory, counts, onConfigureClick, isAdmin }: HomeViewProps) {
  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1200);
  };

  const categories = [
    { id: 'cow', label: 'गायी (Cows)', count: counts.cow, icon: '🐄', color: 'border-emerald-100 hover:bg-emerald-50 bg-emerald-50/20 text-emerald-800' },
    { id: 'buffalo', label: 'म्हशी (Buffaloes)', count: counts.buffalo, icon: '🐃', color: 'border-amber-100 hover:bg-amber-50 bg-amber-50/20 text-amber-900' },
    { id: 'dog', label: 'कुत्रे (Dogs)', count: counts.dog, icon: '🐕', color: 'border-sky-100 hover:bg-sky-50 bg-sky-50/20 text-sky-800' },
    { id: 'hen', label: 'कोंबड्या (Hens)', count: counts.hen, icon: '🐓', color: 'border-red-100 hover:bg-red-50 bg-red-50/20 text-red-800' },
    { id: 'egg', label: 'अंडी (Eggs)', count: counts.egg, icon: '🥚', color: 'border-orange-100 hover:bg-orange-50 bg-orange-50/20 text-orange-900' },
    { id: 'manure', label: 'शेणखत (Manure)', count: counts.manure, icon: '💩', color: 'border-amber-200 hover:bg-amber-100/30 bg-amber-100/10 text-amber-950' },
    { id: 'fodder', label: 'मका चारा (Fodder)', count: counts.fodder, icon: '🌾', color: 'border-green-200 hover:bg-green-50 bg-green-50/10 text-green-800' },
  ];

  return (
    <div className="space-y-10 py-2">
      {/* 1. Hero Welcoming Banner */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-lg overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-700/30 rounded-full blur-xl -ml-16 -mb-16 pointer-events-none" />
        
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>महाराष्ट्रातील सर्वात मोठे विनामूल्य पशु बाजार</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            थेट खरेदी-विक्री करा, दलाल आणि कमिशनला कायमचा रामराम!
          </h2>
          <p className="text-sm sm:text-base text-amber-50 leading-relaxed max-w-2xl">
            गाय, म्हैस, कुत्रे, कोंबडी, अंडी आणि शेती साहित्य खरेदी व विक्रीसाठी विश्वसनीय व्यासपीठ. कोणत्याही लॉगिन किंवा साईन-अपशिवाय तुमची जाहिरात अवघ्या २ मिनिटांत प्रसिद्ध करा.
          </p>
          
          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onSelectCategory('all')}
              className="bg-white hover:bg-amber-50 text-amber-700 font-extrabold px-6 py-3 rounded-2xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              सर्व जाहिराती पहा (Browse Ads)
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectCategory('nearby')}
              className="bg-amber-800/90 hover:bg-amber-950 text-white border border-amber-400/40 font-extrabold px-6 py-3 rounded-2xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              📍 आपल्या जवळचे पशु पहा (Nearby)
            </button>
            <a
              href="#about-us-section"
              className="bg-amber-700/40 hover:bg-amber-700/60 border border-amber-400/30 font-bold px-5 py-3 rounded-2xl text-sm transition-all flex items-center gap-1.5"
            >
              🔎 आमच्याबद्दल जाणून घ्या
            </a>
          </div>
        </div>
      </motion.section>

      {/* 2. Quick Category Browsing Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-amber-600 rounded-sm inline-block"></span>
            पशू आणि साहित्य वर्गवारी निवडा
          </h3>
          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-md">
            एकूण {counts.total} उपलब्ध जाहिराती
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 group hover:scale-[1.02] cursor-pointer shadow-2xs hover:shadow-sm ${cat.color}`}
            >
              <span className="text-3xl transition-transform group-hover:scale-110 duration-200">{cat.icon}</span>
              <span className="text-xs font-bold block">{cat.label}</span>
              <span className="text-[10px] font-mono font-bold bg-white/70 px-2 py-0.5 rounded-full border border-gray-100">
                {cat.count} नग
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* AdSense Section 3 (Home Middle Banner) */}
      <AdSenseBanner
        placement="header"
        onConfigureClick={onConfigureClick}
        isAdmin={isAdmin}
      />

      {/* 3. About Us & Story Section */}
      <section id="about-us-section" className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-100">
              <User className="w-3.5 h-3.5" />
              <span>आमच्याबद्दल (About Us)</span>
            </div>
            
            <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              महाराष्ट्रातील शेतकऱ्यांचे हित आणि स्वावलंबन हेच आमचे ध्येय!
            </h3>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              नमस्कार शेतकरी मित्रांनो, माझे नाव <strong>आदित्य म्हेत्रे (Aditya Mhetre)</strong> आहे. मी हे <strong>'महाराष्ट्र पशू बाजार'</strong> व्यासपीठ महाराष्ट्रातील शेतकरी बांधव, पशुपालक आणि ग्रामीण जनतेच्या सोयीसाठी विकसित केले आहे.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">१००% मोफत आणि कमिशन-मुक्त (Commission Free)</p>
                  <p className="text-xs text-slate-500">आम्ही खरेदीदार किंवा विक्रेता दोघांकडूनही कोणतेही छुपे शुल्क किंवा कमिशन घेत नाही.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">कोणत्याही लॉगिनची गरज नाही (No Sign Up Needed)</p>
                  <p className="text-xs text-slate-500">शेतकऱ्यांचा वेळ वाचवण्यासाठी आणि गुंतागुंत टाळण्यासाठी युझरनेम किंवा पासवर्डची आवश्यकता नाही.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">थेट संवाद आणि सुरक्षित व्यवहार</p>
                  <p className="text-xs text-slate-500">विक्रेत्याचा मोबाईल क्रमांक जाहिरातीत थेट दिलेला असतो, जेणेकरून खरेदीदार थेट कॉल किंवा व्हॉट्सॲप करू शकतात.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-amber-50/40 rounded-2xl p-6 border border-amber-100/50 space-y-4">
            <h4 className="font-extrabold text-slate-800 text-base">👨‍💻 डेव्हलपरचा संदेश</h4>
            <div className="text-xs sm:text-sm text-slate-600 space-y-3 italic">
              <p>
                "मी पाहिलं आहे की बऱ्याचदा ग्रामीण भागात प्राण्यांची खरेदी-विक्री करताना दलालांना खूप मोठी रक्कम कमिशन म्हणून द्यावी लागते. यामुळे शेतकऱ्यांचा आर्थिक तोटा होतो."
              </p>
              <p>
                "हे टाळण्यासाठी मी हे सोपे व्यासपीठ बनवले आहे. येथे केवळ फोटो अपलोड करून शेतकरी थेट स्वतःच्या किमतीत प्राणी विकू शकतात. जर तुम्हाला आमचे हे काम आवडले, तर नक्की 'मदत करा' बटनावर क्लिक करून आम्हाला सहकार्य करा जेणेकरून आम्ही हे सर्व्हर चालवत राहू शकू."
              </p>
            </div>
            <div className="pt-2 border-t border-amber-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center">
                AM
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">आदित्य म्हेत्रे (Aditya Mhetre)</p>
                <p className="text-[10px] text-slate-500 font-semibold">मुख्य संस्थापक व डेव्हलपर, महाराष्ट्र पशू बाजार</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Contact Us Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Contact Info Card */}
        <div className="md:col-span-5 bg-slate-950 text-slate-200 rounded-3xl p-6 sm:p-8 border border-slate-850 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-amber-400">
              <Mail className="w-3.5 h-3.5" />
              <span>थेट संपर्क केंद्र</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              आम्हाला कधीही संपर्क करा!
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              तुम्हाला काही मदत हवी असल्यास, जाहिरात काढायची असल्यास, किंवा काही तांत्रिक समस्या आल्यास खालील ईमेल वर थेट संपर्क साधा.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3.5 p-3.5 bg-slate-900 rounded-xl border border-slate-800 hover:border-amber-600/30 transition-all">
                <div className="w-10 h-10 rounded-lg bg-amber-600/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">ईमेल पत्ता (Email Support)</p>
                  <a href="mailto:akmhetre09@gmail.com" className="text-xs sm:text-sm font-bold text-amber-400 hover:underline">
                    akmhetre09@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-emerald-600/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">मदत वेळ (Availability)</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-200">
                    २४ तास उपलब्ध (२४-४८ तासांत उत्तर)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-900 text-[10px] sm:text-xs text-slate-500">
            *कृपया लक्षात घ्या: प्राणी खरेदी-विक्रीच्या व्यवहाराचे अंतिम बोलणे खरेदीदार व विक्रेत्यामध्ये थेट होते.
          </div>
        </div>

        {/* Contact Message Form */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-600" />
            तुमचा संदेश किंवा सूचना पाठवा
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            तुमचा अभिप्राय आमच्यासाठी अत्यंत महत्त्वाचा आहे. खालील फॉर्म भरा आणि आम्हाला पाठवा.
          </p>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">तुमचे नाव (Name) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="उदा. राहुल चव्हाण"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-amber-600 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">मोबाईल नंबर (WhatsApp)</label>
                <input
                  type="tel"
                  placeholder="उदा. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-amber-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">ईमेल पत्ता (Email)</label>
              <input
                type="email"
                placeholder="उदा. rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-amber-600 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">तुमचा संदेश (Message) <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={4}
                placeholder="तुमची अडचण, सूचना किंवा प्रश्न येथे लिहा..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-amber-600 focus:bg-white transition-all resize-none"
              />
            </div>

            {submitStatus === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>धन्यवाद! तुमचा संदेश यशस्वीरित्या प्राप्त झाला आहे. आम्ही लवकरच तुमच्याशी संपर्क करू.</span>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold"
              >
                कृपया सर्व आवश्यक रकाने (नाव आणि संदेश) अचूकपणे भरा.
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'पाठवत आहे...' : 'संदेश पाठवा (Send Message)'}
            </button>
          </form>
        </div>
      </section>

      {/* 5. Privacy Policy Section */}
      <section className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-100">
          <Shield className="w-3.5 h-3.5" />
          <span>गोपनीयता धोरण (Privacy Policy)</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          तुमच्या गोपनीयतेचे संरक्षण हे आमचे कर्तव्य आहे
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                कोणती माहिती गोळा केली जाते?
              </h4>
              <p className="leading-relaxed text-xs">
                महाराष्ट्र पशू बाजार हे विना लॉगिन चालणारे थेट व्यासपीठ आहे. आम्ही युझर्सचा कोणताही वैयक्तिक डेटा बॅकएंड सर्व्हरवर साठवत नाही. जेव्हा तुम्ही जाहिरात प्रसिद्ध करता, तेव्हा फक्त तुमच्या संमतीने तुमचा मोबाईल क्रमांक, नाव आणि जिल्ह्याची माहिती जाहिरात पाहणाऱ्या ग्राहकांना दाखवली जाते.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                लोकल स्टोरेजचा वापर (LocalStorage)
              </h4>
              <p className="leading-relaxed text-xs">
                तुमच्या अपलोड केलेल्या जाहिरातींचा इतिहास साठवण्यासाठी आम्ही फक्त तुमच्या ब्राउझरमधील 'लोकल स्टोरेज' चा वापर करतो. आम्ही तुमच्या फोनमधील कोणत्याही वैयक्तिक फाईल्स, गॅलरी किंवा संपर्क नंबरला परवानगीशिवाय ॲक्सेस करत नाही.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                थेट ग्राहक-विक्रेता संबंध व व्यवहार
              </h4>
              <p className="leading-relaxed text-xs">
                हे ॲप केवळ खरेदीदार आणि विक्रेता यांना थेट जोडणारे एक व्यासपीठ आहे. दोन व्यक्तींमध्ये होणाऱ्या आर्थिक व्यवहारांशी किंवा फसवणुकीशी या व्यासपीठाचा थेट संबंध नसतो. त्यामुळे कोणत्याही व्यवहारापूर्वी प्रत्यक्ष जाऊन पशूची आणि मालकाची खात्री करा. कधीही आगाऊ टोकन रक्कम बँक ट्रान्सफर करू नका.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                धोरण बदल आणि संपर्क
              </h4>
              <p className="leading-relaxed text-xs">
                आम्ही वेळोवेळी सुरक्षा किंवा नियमावली सुधारण्यासाठी आमच्या धोरणात बदल करू शकतो. आपल्याला याबद्दल काही शंका असल्यास आपण थेट आमच्याशी <a href="mailto:akmhetre09@gmail.com" className="text-amber-600 underline font-bold">akmhetre09@gmail.com</a> वर संपर्क साधू शकता.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
