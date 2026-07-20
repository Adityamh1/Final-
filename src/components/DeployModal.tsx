import { useState } from 'react';
import { X, Check, Copy, Sparkles, Globe, Github, Cpu, Layers, Download, BookOpen, Terminal, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DeployModalProps {
  onClose: () => void;
}

export default function DeployModal({ onClose }: DeployModalProps) {
  const [activePlatform, setActivePlatform] = useState<'github' | 'netlify' | 'vercel' | 'cloudflare'>('github');
  const [copied, setCopied] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const configFiles = {
    github: {
      filename: '.github/workflows/deploy.yml',
      title: 'GitHub Actions Workflow',
      code: `name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`
    },
    netlify: {
      filename: 'netlify.toml',
      title: 'Netlify Configuration',
      code: `[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`
    },
    vercel: {
      filename: 'vercel.json',
      title: 'Vercel Configuration',
      code: `{
  "version": 2,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}`
    },
    cloudflare: {
      filename: '_headers',
      title: 'Cloudflare Pages Configuration',
      code: `/*
  Cache-Control: public, max-age=31536000, immutable
/index.html
  Cache-Control: no-cache`
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleDownloadFile = (platformKey: keyof typeof configFiles) => {
    const file = configFiles[platformKey];
    const element = document.createElement("a");
    const fileContent = new Blob([file.code], {type: 'text/plain'});
    element.href = URL.createObjectURL(fileContent);
    element.download = file.filename.split('/').pop() || 'config';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast(`"${file.filename.split('/').pop()}" फाईल डाउनलोड झाली!`);
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
          className="relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 px-6 py-5 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-500 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-bold font-sans">फ्री पब्लिश आणि होस्टिंग पर्याय (Deploy & Publish Free)</h2>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-slate-800 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            
            {/* Top overview badge cards */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                <p className="font-bold mb-1">पशु बाजार ॲप मोफत प्रकाशित करा! 🚀</p>
                हे पशू बाजार ॲप पूर्णपणे क्लायंट-साईड तंत्रज्ञानावर (React/Vite) आधारित आहे. खालीलपैकी कोणत्याही प्रसिद्ध प्लॅटफॉर्मवर हे ॲप <strong>₹० (रुपये शून्य)</strong> खर्चात, स्वतःच्या नावाचे डोमेन लावून किंवा फ्री सबडोमेनसह आयुष्यभरासाठी मोफत होस्ट केले जाऊ शकते!
              </div>
            </div>

            {/* Platform selection tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3">
              {[
                { id: 'github', label: 'GitHub Pages', icon: Github, color: 'text-slate-900' },
                { id: 'netlify', label: 'Netlify', icon: Globe, color: 'text-emerald-600' },
                { id: 'vercel', label: 'Vercel', icon: Cpu, color: 'text-indigo-600' },
                { id: 'cloudflare', label: 'Cloudflare Pages', icon: Layers, color: 'text-orange-500' }
              ].map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setActivePlatform(platform.id as any)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    activePlatform === platform.id 
                      ? 'bg-slate-950 text-white border-slate-950 shadow-sm' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <platform.icon className={`w-4 h-4 ${activePlatform === platform.id ? 'text-amber-400' : platform.color}`} />
                  {platform.label}
                </button>
              ))}
            </div>

            {/* Dynamic details section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Instructions */}
              <div className="lg:col-span-7 space-y-4">
                
                {activePlatform === 'github' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">पद्धत १</span>
                      <h3 className="font-extrabold text-slate-900 text-base">GitHub Pages वर पब्लिश करा</h3>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      GitHub हा कोड सुरक्षित ठेवण्यासाठी आणि विनामूल्य होस्टिंगसाठी जगातील सर्वात लोकप्रिय प्लॅटफॉर्म आहे. GitHub Pages द्वारे हे ॲप पूर्णपणे मोफत चालू होते.
                    </p>

                    <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                      <p className="font-bold text-slate-800">खालील कृती करा (Steps):</p>
                      <ol className="list-decimal list-inside space-y-2 pl-1 leading-relaxed">
                        <li>GitHub वर मोफत खाते उघडा आणि नवीन <strong>Repository</strong> तयार करा.</li>
                        <li>या ॲपचा कोड GitHub वर अपलोड करा.</li>
                        <li>खालील <strong>workflows फाईल</strong> तुमच्या रिपॉझिटरीमध्ये <code>.github/workflows/deploy.yml</code> या नावाने जोडा.</li>
                        <li>GitHub Settings मध्ये जाऊन <strong>Pages</strong> वर जा आणि Source "GitHub Actions" निवडा.</li>
                        <li>प्रत्येक वेळी तुम्ही कोड अपडेट कराल, तेव्हा हे ॲप आपोआप पुन्हा पब्लिश होईल!</li>
                      </ol>
                    </div>

                    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-xs text-emerald-800 leading-relaxed font-medium">
                      ✓ विनामूल्य कस्टमाइज्ड सबडोमेन: <code>username.github.io/repo</code><br/>
                      ✓ स्वतःचे वैयक्तिक डोमेन (Custom Domain) जोडणे पूर्णपणे मोफत!
                    </div>
                  </div>
                )}

                {activePlatform === 'netlify' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">पद्धत २</span>
                      <h3 className="font-extrabold text-slate-900 text-base">Netlify वर एका मिनिटात पब्लिश करा</h3>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Netlify वर कोड डिप्लॉय करणे अत्यंत सोपे आहे. यासाठी कोणत्याही तांत्रिक ज्ञानाची गरज नाही. तुम्ही थेट ड्रॅग अँड ड्रॉप देखील करू शकता!
                    </p>

                    <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                      <p className="font-bold text-slate-800">दोन सोपे मार्ग (Two Ways to Deploy):</p>
                      <div className="space-y-3 mt-1">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <p className="font-bold text-slate-900 text-xs mb-1">मार्ग अ: थेट फोल्डर अपलोड (Drag & Drop)</p>
                          <p className="text-xs text-slate-600">तुमच्या प्रोजेक्टमधील <code>dist</code> फोल्डरचे (Build नंतर तयार होणारे) ZIP बनवा आणि <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline font-bold inline-flex items-center gap-0.5">Netlify Drop <ExternalLink className="w-3 h-3" /></a> वर टाकून द्या. ५ सेकंदात ॲप चालू होईल!</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <p className="font-bold text-slate-900 text-xs mb-1">मार्ग ब: GitHub कनेक्ट करून (Auto-Deploy)</p>
                          <p className="text-xs text-slate-600">Netlify वर लॉगइन करून "Import from GitHub" निवडा आणि तुमचे रिपॉझिटरी निवडा. आमची <code>netlify.toml</code> फाईल स्वयंचलित कॉन्फिगरेशन करेल.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activePlatform === 'vercel' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">पद्धत ३</span>
                      <h3 className="font-extrabold text-slate-900 text-base">Vercel वर होस्टिंग (सर्वोत्तम गती)</h3>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Vercel हा React आणि Vite ॲप्ससाठी जगातील सर्वात वेगवान आणि प्रगत सर्व्हर मानला जातो. येथे देखील मोफत होस्टिंग उपलब्ध आहे.
                    </p>

                    <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                      <p className="font-bold text-slate-800">कसे करावे (Instructions):</p>
                      <ol className="list-decimal list-inside space-y-2 pl-1 leading-relaxed">
                        <li><a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline font-bold inline-flex items-center gap-0.5">Vercel.com <ExternalLink className="w-3 h-3" /></a> वर जाऊन मोफत खाते उघडा.</li>
                        <li>"Add New Project" वर क्लिक करून तुमचे GitHub रिपॉझिटरी लिंक करा.</li>
                        <li>Vercel आपोआप हे Vite ॲप ओळखून <strong>npm run build</strong> चालवेल.</li>
                        <li>फक्त "Deploy" बटणावर क्लिक करा!</li>
                      </ol>
                    </div>

                    <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 text-xs text-indigo-800 leading-relaxed font-medium">
                      ✓ रूटिंग सुसंगततेसाठी आम्ही खाली दिलेली <code>vercel.json</code> फाईल आधीच तयार केली आहे, ज्यामुळे सर्व पेजेस त्रुटीशिवाय उघडतात!
                    </div>
                  </div>
                )}

                {activePlatform === 'cloudflare' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">पद्धत ४</span>
                      <h3 className="font-extrabold text-slate-900 text-base">Cloudflare Pages (अमर्याद बँडविड्थ)</h3>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Cloudflare हा जगभरातील कोट्यवधी वेबसाईट सुरक्षित आणि जलद ठेवणारा प्लॅटफॉर्म आहे. Cloudflare Pages वर अमर्यादित ट्रॅफिक देखील मोफत हाताळले जाते.
                    </p>

                    <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                      <p className="font-bold text-slate-800">डिप्लॉयमेंट कृती (Deploy Steps):</p>
                      <ol className="list-decimal list-inside space-y-2 pl-1 leading-relaxed">
                        <li>Cloudflare डॅशबोर्डवर जा आणि <strong>Workers & Pages</strong> निवडा.</li>
                        <li>"Create Application" वर क्लिक करून Pages टॅबमध्ये जा आणि GitHub रिपॉझिटरी जोडा.</li>
                        <li>Framework preset मध्ये <strong>Vite</strong> निवडा आणि Build डिरेक्टरी <strong>dist</strong> ठेवा.</li>
                        <li>Save and Deploy वर दाबा.</li>
                      </ol>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-3 border border-orange-100 text-xs text-orange-800 leading-relaxed font-medium">
                      ✓ गती वाढवण्यासाठी आणि कॅशिंग मजबूत करण्यासाठी आम्ही <code>_headers</code> फाईल तयार केली आहे!
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Code Generator */}
              <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between max-h-[420px]">
                
                <div className="space-y-3 overflow-hidden flex flex-col flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <FileText className="w-4 h-4 text-slate-400" />
                      {configFiles[activePlatform].title}
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => handleCopyCode(configFiles[activePlatform].code)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">कॉपी झाला!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>कॉपी</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-3 font-mono text-[10px] leading-relaxed text-slate-300 overflow-y-auto flex-1 max-h-48 border border-slate-800">
                    <div className="text-[10px] text-slate-500 mb-1 border-b border-slate-800 pb-1 flex justify-between">
                      <span>{configFiles[activePlatform].filename}</span>
                      <span className="text-amber-500 font-bold uppercase">फ्री कॉन्फिगरेशन</span>
                    </div>
                    <pre className="whitespace-pre-wrap">{configFiles[activePlatform].code}</pre>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-4 space-y-2">
                  <button
                    onClick={() => handleDownloadFile(activePlatform)}
                    className="w-full bg-slate-950 hover:bg-slate-900 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    कॉन्फिगरेशन फाईल डाउनलोड करा
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">
                    ही फाईल डाउनलोड करून प्रोजेक्टच्या मुख्य फोल्डरमध्ये (Root) ठेवा.
                  </p>
                </div>

              </div>

            </div>

            {/* Offline PWA or Native APK export guide */}
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <BookOpen className="w-5 h-5 text-amber-600" />
                महत्वाचे तांत्रिक मार्गदर्शन (Technical Support Guide)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-900 mb-2 flex items-center gap-1">
                    <Terminal className="w-4 h-4 text-amber-600" />
                    स्थानिक स्तरावर बिल्ड बनवणे (Local Build Command)
                  </p>
                  <p>मोफत सर्व्हरवर अपलोड करण्यापूर्वी तुमच्या संगणकावर हा कमांड चालवा:</p>
                  <pre className="bg-slate-900 text-slate-300 p-2 rounded-lg font-mono text-[10px] my-2">npm run build</pre>
                  <p>हा कमांड चालवताच मुख्य फोल्डरमध्ये <code>dist</code> नावाचे फोल्डर तयार होईल, ज्यामध्ये पब्लिश होणारी वेबसाईट साठवली जाते.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-900 mb-2 flex items-center gap-1">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    मोफत डोमेन कुठे मिळेल? (Free Domain Services)
                  </p>
                  <p>जर तुम्हाला <code>.com</code> किंवा <code>.in</code> खरेदी करायचे नसेल, तर खालील मोफत पर्याय वापरा:</p>
                  <ul className="list-disc pl-4 space-y-1 mt-1.5">
                    <li>वर दिलेले सर्व प्लॅटफॉर्म्स मोफत सबडोमेन देतात (उदा. <code>app.netlify.app</code>).</li>
                    <li><a href="https://www.freenom.com" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline">Freenom</a> वरून मोफत <code>.tk</code>, <code>.ml</code>, <code>.cf</code> डोमेन मिळवू शकता.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Close Button */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer"
            >
              समजले (Got it)
            </button>
          </div>
        </motion.div>
      </div>

      {/* Success Toast Notification */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-500"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-300 animate-bounce" />
            <span className="text-xs sm:text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
