import React, { useState, useRef } from 'react';
import { X, Upload, Link2, MapPin, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimalCategory, Listing } from '../types';
import { MAHARASHTRA_DISTRICTS, DEFAULT_ANIMAL_PHOTOS } from '../data';

interface AddListingModalProps {
  onClose: () => void;
  onAddListing: (newListing: Listing) => void;
}

export default function AddListingModal({ onClose, onAddListing }: AddListingModalProps) {
  const [category, setCategory] = useState<AnimalCategory>('cow');
  const [breed, setBreed] = useState('');
  const [price, setPrice] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('पुणे');
  const [sellerName, setSellerName] = useState('');
  const [phone, setPhone] = useState('');
  const [hidePhone, setHidePhone] = useState(false);
  const [details, setDetails] = useState('');
  const [milkCapacity, setMilkCapacity] = useState('');
  const [gender, setGender] = useState<'नर' | 'मादी'>('नर');

  // Photo state
  const [photoType, setPhotoType] = useState<'upload' | 'url' | 'placeholder'>('upload');
  const [photoFile, setPhotoFile] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Validation / Loading state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handlers (converts file to Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('कृपया फक्त फोटो फाईल अपलोड करा!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoFile(event.target.result as string);
        setErrors((prev) => ({ ...prev, photo: '' }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Basic Validation
    if (!breed.trim()) {
      if (category === 'manure') newErrors.breed = 'शेणखताचा प्रकार किंवा नाव आवश्यक आहे!';
      else if (category === 'fodder') newErrors.breed = 'चाऱ्याचे नाव किंवा प्रकार आवश्यक आहे!';
      else if (category === 'egg') newErrors.breed = 'अंड्याचा प्रकार आवश्यक आहे!';
      else newErrors.breed = 'जात किंवा ब्रीडचे नाव आवश्यक आहे!';
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'योग्य किंमत टाका!';
    if (!age.trim()) {
      if (category === 'manure') newErrors.age = 'विक्री दर पद्धत (उदा. प्रति ट्रॉली) आवश्यक आहे!';
      else if (category === 'fodder') newErrors.age = 'विक्रीचे प्रमाण (उदा. प्रति एकर) आवश्यक आहे!';
      else if (category === 'egg') newErrors.age = 'अंड्याचा ताजेपणा आवश्यक आहे!';
      else newErrors.age = 'प्राण्याचे वय आवश्यक आहे!';
    }
    if (!location.trim()) newErrors.location = 'गाव किंवा पत्ता आवश्यक आहे!';
    if (!sellerName.trim()) newErrors.sellerName = 'तुमचे नाव आवश्यक आहे!';
    if (!phone.trim() || !/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = 'योग्य १०-अंकी मोबाईल नंबर टाका!';
    }

    // Determine final photo URL/Base64
    let finalPhoto = '';
    if (photoType === 'upload' && photoFile) {
      finalPhoto = photoFile;
    } else if (photoType === 'url' && photoUrl.trim()) {
      finalPhoto = photoUrl.trim();
    } else {
      // Use category placeholder
      finalPhoto = DEFAULT_ANIMAL_PHOTOS[category];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top of form or focus first error
      return;
    }

    setIsSubmitting(true);

    // Create New Listing object
    const newListing: Listing = {
      id: 'listing-' + Date.now(),
      category,
      breed: breed.trim(),
      price: Number(price),
      age: age.trim() + (category === 'dog' ? '' : ''),
      location: location.trim(),
      district,
      photo: finalPhoto,
      sellerName: sellerName.trim(),
      phone: phone.trim(),
      details: details.trim(),
      milkCapacity: (category === 'cow' || category === 'buffalo') && milkCapacity.trim() ? milkCapacity.trim() : undefined,
      gender: category === 'dog' ? gender : undefined,
      createdAt: new Date().toLocaleDateString('mr-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      createdAtTime: Date.now(),
      hidePhone,
      isLocal: true,
      isPremium: false
    };

    // Simulate submission delay
    setTimeout(() => {
      onAddListing(newListing);
      setIsSubmitting(false);
      onClose();
    }, 800);
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
          className="relative bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-amber-600 px-6 py-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-100" />
              <h2 className="text-xl font-bold font-sans">जाहिरात टाका (Sell Animal)</h2>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-amber-700/50 p-1.5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
            {/* 1. Category Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">निवडा (Choose Category)*</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'cow', label: '🐄 गाय (Cow)' },
                  { id: 'buffalo', label: '🐃 म्हैस (Buffalo)' },
                  { id: 'dog', label: '🐕 कुत्रा (Dog)' },
                  { id: 'hen', label: '🐓 कोंबडी (Hen)' },
                  { id: 'egg', label: '🥚 अंडी (Egg)' },
                  { id: 'manure', label: '💩 शेणखत (Manure)' },
                  { id: 'fodder', label: '🌾 मका चारा (Fodder)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const prevCat = category;
                      setCategory(item.id as AnimalCategory);
                      // Clear conditionally rendered states or set default values when switching
                      if (item.id === 'egg') {
                        setAge('ताजी अंडी');
                        setBreed('');
                      } else if (item.id === 'manure') {
                        setAge('प्रति ट्रॉली');
                        setBreed('प्युअर शेणखत');
                      } else if (item.id === 'fodder') {
                        setAge('प्रति एकर');
                        setBreed('हिरवा मका चारा');
                      } else if (prevCat === 'egg' || prevCat === 'manure' || prevCat === 'fodder') {
                        setAge('');
                        setBreed('');
                      }
                    }}
                    className={`py-2.5 px-3.5 rounded-xl text-xs font-semibold border-2 transition-all flex items-center gap-1.5 ${
                      category === item.id
                        ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-2xs'
                        : 'border-gray-100 hover:border-gray-200 text-gray-700 bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Photo Handling Tabbed Interface */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">प्राण्याचा फोटो जोडा (Add Photo)*</label>
              
              <div className="flex border-b border-gray-100 mb-3 text-xs">
                <button
                  type="button"
                  onClick={() => setPhotoType('upload')}
                  className={`flex-1 pb-2 border-b-2 font-medium transition-colors ${
                    photoType === 'upload' ? 'border-amber-600 text-amber-700 font-semibold' : 'border-transparent text-gray-500'
                  }`}
                >
                  फाइल अपलोड
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoType('url')}
                  className={`flex-1 pb-2 border-b-2 font-medium transition-colors ${
                    photoType === 'url' ? 'border-amber-600 text-amber-700 font-semibold' : 'border-transparent text-gray-500'
                  }`}
                >
                  फोटो लिंक पेस्ट करा
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoType('placeholder')}
                  className={`flex-1 pb-2 border-b-2 font-medium transition-colors ${
                    photoType === 'placeholder' ? 'border-amber-600 text-amber-700 font-semibold' : 'border-transparent text-gray-500'
                  }`}
                >
                  प्रॉडक्ट फोटो वापरा
                </button>
              </div>

              {/* Photo Input rendering */}
              {photoType === 'upload' && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[140px] ${
                    isDragging ? 'border-amber-600 bg-amber-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {photoFile ? (
                    <div className="relative w-full max-h-[120px] rounded-lg overflow-hidden flex justify-center items-center">
                      <img src={photoFile} alt="Preview" className="max-h-[120px] object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhotoFile(null);
                        }}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">इथे क्लिक करा किंवा फोटो ओढून आणा (Drag & Drop)</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG फॉरमॅट</p>
                    </>
                  )}
                </div>
              )}

              {photoType === 'url' && (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      placeholder="https://example.com/cow-image.jpg"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                    />
                  </div>
                  {photoUrl && (
                    <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                      <img src={photoUrl} alt="Preview URL" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = DEFAULT_ANIMAL_PHOTOS[category]} />
                    </div>
                  )}
                </div>
              )}

              {photoType === 'placeholder' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={DEFAULT_ANIMAL_PHOTOS[category]}
                      alt="Category placeholder"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <span className="text-xs text-amber-800 font-bold block">ॲपचा मुख्य फोटो निवडला जाईल</span>
                      <span className="text-[11px] text-gray-500">तुम्ही फोटो नाही जोडला तरी हा फोटो आपोआप दिसेल.</span>
                    </div>
                  </div>
                  <Check className="w-5 h-5 text-emerald-600 font-bold" />
                </div>
              )}
            </div>

            {/* 3. Breed & Age Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">
                  {category === 'egg' ? 'अंड्याचा प्रकार / जात (Type)*' : category === 'hen' ? 'कोंबडीची जात (Hen Breed)*' : category === 'manure' ? 'खत प्रकार / नाव (Manure Type)*' : category === 'fodder' ? 'चाऱ्याचे नाव / प्रकार (Fodder Type)*' : 'जात / वंश (Breed)*'}
                </label>
                <input
                  type="text"
                  placeholder={category === 'egg' ? 'उदा. गावरान, बॉयलर, कडकनाथ' : category === 'hen' ? 'उदा. गावरान, कडकनाथ' : category === 'manure' ? 'उदा. प्युअर सेंद्रिय शेणखत, कंपोस्ट' : category === 'fodder' ? 'उदा. हिरवा मका चारा, सुका मका चारा' : 'उदा. खिलार, गीर, लॅब्राडोर'}
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 ${
                    errors.breed ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.breed && <span className="text-red-500 text-xs">{errors.breed}</span>}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">
                  {category === 'egg' ? 'ताजेपणा / तपशील (Details)*' : category === 'manure' ? 'विक्री प्रकार / दर*' : category === 'fodder' ? 'प्रमाण / क्षेत्रफळ (Acre)*' : 'वय (Age)*'}
                </label>
                <input
                  type="text"
                  placeholder={category === 'egg' ? 'उदा. ताजी अंडी, ३ दिवस जुनी' : category === 'manure' ? 'उदा. प्रति ट्रॉली, प्रति डंपर/टेलर' : category === 'fodder' ? 'उदा. प्रति एकर, २ एकर मका' : 'उदा. २ वर्षे, ४ महिने'}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 ${
                    errors.age ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.age && <span className="text-red-500 text-xs">{errors.age}</span>}
              </div>
            </div>

            {/* 4. Price & Dynamic fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">
                  {category === 'egg' ? 'किंमत ₹ (प्रति नग/डझन)*' : category === 'manure' ? 'किंमत ₹ (प्रति ट्रॉली दर)*' : category === 'fodder' ? 'किंमत ₹ (प्रति एकर दर)*' : 'किंमत ₹ (Price)*'}
                </label>
                <input
                  type="number"
                  placeholder={category === 'egg' ? 'उदा. १२' : category === 'manure' ? 'उदा. २५००' : category === 'fodder' ? 'उदा. १५०००' : 'उदा. ५५०००'}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 ${
                    errors.price ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.price && <span className="text-red-500 text-xs">{errors.price}</span>}
              </div>

              {/* Conditional rendering for Cow/Buffalo */}
              {(category === 'cow' || category === 'buffalo') && (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">दूध क्षमता (रोजचे लिटर)</label>
                  <input
                    type="text"
                    placeholder="उदा. ८ लिटर"
                    value={milkCapacity}
                    onChange={(e) => setMilkCapacity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              )}

              {/* Conditional rendering for Dog */}
              {category === 'dog' && (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">लिंग (Gender)</label>
                  <div className="grid grid-cols-2 gap-1 h-[38px]">
                    {['नर', 'मादी'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g as 'नर' | 'मादी')}
                        className={`text-xs font-semibold rounded-lg border transition-colors ${
                          gender === g
                            ? 'bg-amber-600 border-amber-600 text-white'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. District Selection & Village/Taluka */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">जिल्हा (District)*</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                >
                  {MAHARASHTRA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">गाव / तालुका (Location)*</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="उदा. शिरूर, मंचर"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 border rounded-xl text-sm focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 ${
                      errors.location ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.location && <span className="text-red-500 text-xs">{errors.location}</span>}
              </div>
            </div>

            {/* 6. Seller Name & Mobile Number */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">तुमचे नाव (Seller Name)*</label>
                <input
                  type="text"
                  placeholder="उदा. तुकाराम पाटील"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 ${
                    errors.sellerName ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.sellerName && <span className="text-red-500 text-xs">{errors.sellerName}</span>}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">मोबाईल नंबर (10 Digit)*</label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="उदा. 98xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 ${
                    errors.phone ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
              </div>
            </div>

            {/* Show / Hide Phone Option */}
            <div className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-gray-200/80">
              <input
                type="checkbox"
                id="hidePhone"
                checked={hidePhone}
                onChange={(e) => setHidePhone(e.target.checked)}
                className="w-4.5 h-4.5 mt-0.5 text-amber-600 bg-white border-gray-300 rounded-sm focus:ring-amber-500 focus:ring-2 cursor-pointer shrink-0"
              />
              <label htmlFor="hidePhone" className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer select-none">
                माझा मोबाईल नंबर लपवा (Hide my Mobile Number)
                <span className="block text-[11px] text-slate-500 font-normal mt-0.5 leading-relaxed">
                  हा पर्याय निवडल्यास, इतर युझर्सना तुमचा मोबाईल नंबर थेट दिसणार नाही. त्यांच्याशी थेट कॉल किंवा व्हॉट्सॲपऐवजी "चौकशी मेसेज (Enquiry SMS)" द्वारे संपर्क होईल.
                </span>
              </label>
            </div>

            {/* 7. Additional details */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">इतर सविस्तर माहिती (Description)</label>
              <textarea
                rows={3}
                placeholder="उदा. तब्येत चांगली आहे, खायला चारा व्यवस्थित खाते, लसीकरण पूर्ण झाले आहे."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 shrink-0">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:bg-amber-400 flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    जाहिरात अपलोड होत आहे...
                  </>
                ) : (
                  'जाहिरात प्रसिद्ध करा (Publish Ad)'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
