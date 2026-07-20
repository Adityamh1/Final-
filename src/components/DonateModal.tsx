import { useState } from 'react';
import { X, Heart, CheckCircle2, QrCode, Sparkles, Loader2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DonateModalProps {
  onClose: () => void;
}

export default function DonateModal({ onClose }: DonateModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(101);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const presets = [21, 51, 101, 251, 501, 1001];

  const handleSimulatePayment = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setIsSuccess(true);
    }, 1800);
  };

  const getAmount = () => {
    if (customAmount) {
      return Number(customAmount);
    }
    return selectedAmount;
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
          <div className="bg-rose-600 px-6 py-5 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-100 animate-pulse fill-rose-100" />
              <h2 className="text-lg sm:text-xl font-bold font-sans">ॲडमिनला मदत करा (Support Us)</h2>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-rose-700/50 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {!isSuccess ? (
              <>
                {/* Promo notice */}
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">हे अॅप पूर्णपणे मोफत आणि दलाल मुक्त आहे</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    आम्ही शेतकरी बांधवांकडून कोणतीही फी किंवा कमिशन घेत नाही. हे व्यासपीठ निरंतर सुरू ठेवण्यासाठी आणि सर्व्हरच्या खर्चासाठी आपण आपले लहानसे योगदान देऊ शकता.
                  </p>
                </div>

                {/* Preset Buttons */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">योगदान रक्कम निवडा (Select Amount)*</label>
                  <div className="grid grid-cols-3 gap-2">
                    {presets.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all ${
                          !customAmount && selectedAmount === amt
                            ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-xs'
                            : 'border-slate-100 hover:border-slate-200 text-slate-700 bg-slate-50/50'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount input */}
                <div className="space-y-1">
                  <input
                    type="number"
                    placeholder="इतर रक्कम टाका (Custom Amount)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-rose-600 focus:bg-white focus:ring-1 focus:ring-rose-600 transition-all"
                  />
                </div>

                {/* Simulated QR Code Graphic */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center space-y-2">
                  <div className="w-36 h-36 bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center relative shadow-xs">
                    <QrCode className="w-32 h-32 text-slate-800" />
                    <div className="absolute inset-0 m-auto w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm border-2 border-white">
                      पशू
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">अधिकृत यूपीआय आयडी (UPI ID)</span>
                    <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">pashubazaar@upi</p>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={handleSimulatePayment}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      पेमेंट सुरक्षितपणे कनेक्ट होत आहे...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-rose-100" />
                      ₹{getAmount()} ऑनलाईन पेमेंट सिम्युलेट करा
                    </>
                  )}
                </button>
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
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">खूप खूप धन्यवाद (Thank You!)</span>
                  <h3 className="font-extrabold text-slate-900 text-xl">तुमची मदत यशस्वी झाली!</h3>
                  <p className="text-slate-600 font-bold font-mono text-lg mt-1">₹{getAmount()} प्राप्त झाले</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed border border-slate-100">
                  तुमचे हे मौल्यवान योगदान आम्हाला शेतकरी बांधवांसाठी हे व्यासपीठ चालू ठेवण्यास मदत करेल. आम्ही वचन देतो की "महाराष्ट्र पशू बाजार" नेहमी कमिशन-मुक्त आणि सर्वांसाठी मोफत राहील!
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
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
