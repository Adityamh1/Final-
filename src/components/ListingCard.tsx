import { Listing } from '../types';
import { MapPin, Phone, MessageSquare, Calendar, Eye, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ListingCardProps {
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
  onDeleteListing?: (id: string) => void;
}

export default function ListingCard({ listing, onViewDetails, onDeleteListing }: ListingCardProps) {
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'cow':
        return {
          label: 'गाय (Cow)',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'buffalo':
        return {
          label: 'म्हैस (Buffalo)',
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          dot: 'bg-amber-700',
        };
      case 'dog':
        return {
          label: 'कुत्रा (Dog)',
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          dot: 'bg-sky-500',
        };
      case 'hen':
        return {
          label: 'कोंबडी (Hen)',
          bg: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500',
        };
      case 'egg':
        return {
          label: 'अंडी (Egg)',
          bg: 'bg-orange-50 text-orange-800 border-orange-200',
          dot: 'bg-orange-500',
        };
      case 'manure':
        return {
          label: '💩 शेणखत (Manure)',
          bg: 'bg-amber-100 text-amber-950 border-amber-300',
          dot: 'bg-amber-800',
        };
      case 'fodder':
        return {
          label: '🌾 मका चारा (Fodder)',
          bg: 'bg-green-50 text-green-800 border-green-200',
          dot: 'bg-green-500',
        };
      default:
        return {
          label: 'प्राणी',
          bg: 'bg-gray-50 text-gray-700 border-gray-200',
          dot: 'bg-gray-500',
        };
    }
  };

  const badge = getCategoryBadge(listing.category);

  // Format price to Indian Rupee style
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Check if contact is unlocked for this listing
  const isMyAd = (() => {
    if (listing.isLocal) return true;
    const myUid = localStorage.getItem('pashu_device_id');
    if (myUid && listing.deviceId === myUid) return true;
    return false;
  })();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      id={`listing-${listing.id}`}
      className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col h-full ${
        listing.isPremium
          ? 'border-amber-400 bg-gradient-to-b from-white via-white to-amber-50/20 shadow-md ring-1 ring-amber-400/30 hover:shadow-lg hover:border-amber-500'
          : 'border-gray-100 bg-white shadow-xs hover:shadow-md'
      }`}
    >
      {/* Listing Image */}
      <div className="relative aspect-4/3 w-full bg-gray-50 overflow-hidden">
        <img
          src={listing.photo}
          alt={listing.breed}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Animal Badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full border flex items-center gap-1.5 shadow-xs backdrop-blur-xs ${badge.bg}`}>
          <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
          {badge.label}
        </span>

        {/* Badges container top right */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
          {listing.isPremium && (
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md border border-amber-400 flex items-center gap-1">
              ✨ VIP प्रीमियम
            </span>
          )}
          {isMyAd && (
            <div className="flex items-center gap-1.5">
              <span className="bg-orange-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-xs">
                माझी जाहिरात
              </span>
              {onDeleteListing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('तुम्हाला ही जाहिरात खरोखर हटवायची आहे का?')) {
                      onDeleteListing(listing.id);
                    }
                  }}
                  className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-full border border-red-200 transition-colors shadow-xs cursor-pointer"
                  title="जाहिरात हटवा"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Breed Name & Price */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-amber-700 transition-colors">
              {listing.breed}
            </h3>
            <span className="font-bold text-emerald-700 text-lg shrink-0">
              {formatPrice(listing.price)}
            </span>
          </div>

          {/* District & Location */}
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="line-clamp-1">
              <strong>{listing.district}</strong> • {listing.location}
            </span>
          </div>

          {/* Quick info badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-md border border-gray-100">
              {listing.category === 'egg' ? 'तपशील' : listing.category === 'manure' ? 'दर' : listing.category === 'fodder' ? 'प्रमाण' : 'वय'}: {listing.age}
            </span>
            {listing.milkCapacity && (
              <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-md border border-emerald-100">
                दूध: {listing.milkCapacity}
              </span>
            )}
            {listing.gender && (
              <span className="bg-sky-50 text-sky-800 text-xs px-2.5 py-1 rounded-md border border-sky-100">
                लिंग: {listing.gender}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
          {/* Main View Details Button */}
          <button
            onClick={() => onViewDetails(listing)}
            className="w-full bg-amber-50 hover:bg-amber-100 text-amber-950 font-medium py-2 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            संपूर्ण माहिती पाहा
          </button>

          {/* Call & WhatsApp buttons side by side */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${listing.phone}`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5" />
              कॉल करा
            </a>
            <a
              href={`https://wa.me/91${listing.phone}?text=नमस्कार, मला पशू बाजार ॲपवर तुमची ${listing.breed} (${listing.district}) आवडली आहे. ती अजून विक्रीसाठी उपलब्ध आहे का?`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              व्हॉट्सॲप
            </a>
          </div>

          {/* Date Posted */}
          <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mt-1">
            <Calendar className="w-3 h-3" />
            <span>जाहिरात तारीख: {listing.createdAt}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
