import { Listing } from '../types';
import { 
  X, MapPin, Phone, MessageSquare, Calendar, User, Info, 
  Milk, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AdSenseBanner from './AdSenseBanner';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export default function ListingDetailModal({ listing, onClose }: ListingDetailModalProps) {
  if (!listing) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'cow': return 'गाय (Cow)';
      case 'buffalo': return 'म्हैस (Buffalo)';
      case 'dog': return 'कुत्रा (Dog)';
      case 'hen': return 'कोंबडी (Hen)';
      case 'egg': return 'अंडी (Egg)';
      case 'manure': return '💩 शेणखत (Manure)';
      case 'fodder': return '🌾 मका चारा (Maize Fodder)';
      default: return 'प्राणी';
    }
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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto flex-1 pb-6">
            {/* Image Header */}
            <div className="relative aspect-16/10 w-full bg-gray-100">
              <img
                src={listing.photo}
                alt={listing.breed}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-amber-500 text-amber-950 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {getCategoryName(listing.category)}
                </span>
                <h2 className="text-2xl font-bold mt-2 font-sans tracking-tight">
                  {listing.breed}
                </h2>
              </div>
            </div>

            {/* Quick Pricing Ribbon */}
            <div className="bg-amber-50 border-y border-amber-100 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
              <div>
                <span className="text-xs text-amber-900/60 uppercase font-bold tracking-wider block">किंमत (Price)</span>
                <span className="text-2xl font-extrabold text-amber-950 font-mono">
                  {formatPrice(listing.price)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <a
                  href={`tel:${listing.phone}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  कॉल करा
                </a>
                <a
                  href={`https://wa.me/91${listing.phone}?text=नमस्कार, मला पशू बाजार ॲपवर तुमची ${listing.breed} (${listing.district}) आवडली आहे. ती अजून विक्रीसाठी उपलब्ध आहे का?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-colors flex items-center gap-2 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  व्हॉट्सॲप
                </a>
              </div>
            </div>

            {/* Main Information */}
            <div className="px-6 pt-6 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/80 flex items-center gap-3">
                  <div className="p-2 bg-amber-100/50 rounded-lg text-amber-800">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">
                      {listing.category === 'egg' ? 'तपशील' : listing.category === 'manure' ? 'विक्री प्रकार/दर' : listing.category === 'fodder' ? 'प्रमाण / क्षेत्र' : 'वय (Age)'}
                    </span>
                    <span className="font-semibold text-gray-900">{listing.age}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/80 flex items-center gap-3">
                  <div className="p-2 bg-emerald-100/50 rounded-lg text-emerald-800">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs text-gray-500 block">जिल्हा (District)</span>
                    <span className="font-semibold text-gray-900 block truncate">{listing.district}</span>
                  </div>
                </div>

                {listing.milkCapacity && (
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/80 flex items-center gap-3">
                    <div className="p-2 bg-sky-100/50 rounded-lg text-sky-800">
                      <Milk className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">दूध क्षमता (Milk Capacity)</span>
                      <span className="font-semibold text-gray-900">{listing.milkCapacity}</span>
                    </div>
                  </div>
                )}

                {listing.gender && (
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/80 flex items-center gap-3">
                    <div className="p-2 bg-pink-100/50 rounded-lg text-pink-800">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">लिंग (Gender)</span>
                      <span className="font-semibold text-gray-900">{listing.gender}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Exact Location */}
              <div className="border border-gray-100 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm border-b border-gray-50 pb-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  पत्ता / स्थान (Full Address)
                </h4>
                <p className="text-gray-700 text-sm">
                  गाव / तालुका / रस्ता: <strong className="text-gray-900">{listing.location}</strong>
                </p>
                <p className="text-gray-700 text-sm">
                  जिल्हा: <strong className="text-gray-900">{listing.district}</strong>, महाराष्ट्र
                </p>
              </div>

              {/* Detailed Description */}
              <div className="border border-gray-100 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm border-b border-gray-50 pb-2">
                  <Info className="w-4 h-4 text-amber-600" />
                  इतर सविस्तर माहिती (Description)
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {listing.details || 'या प्राण्याबद्दल सविस्तर माहिती उपलब्ध नाही.'}
                </p>
              </div>

              {/* Seller details */}
              <div className="bg-amber-50/40 rounded-xl p-4 border border-amber-100/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-600/10 flex items-center justify-center text-amber-800">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-amber-800 block font-medium">विक्रेता (Seller)</span>
                    <span className="font-bold text-gray-900 text-base">{listing.sellerName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">मोबाईल नंबर (Mobile)</span>
                  <span className="font-mono font-bold text-gray-900 text-base">
                    {listing.phone}
                  </span>
                </div>
              </div>

              {/* AdSense Section 4 (Listing Detail Ad Banner) */}
              <div className="py-2">
                <AdSenseBanner
                  placement="header"
                />
              </div>

              {/* Safety notice for buyers */}
              <div className="text-center p-3 bg-red-50 text-red-800 border border-red-100 rounded-lg text-xs">
                ⚠️ <strong>सुरक्षा सूचना:</strong> प्राण्याची स्वतः पाहणी करून खात्री केल्याशिवाय आगाऊ पैशांचे व्यवहार (Advance Payment) करू नका!
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
