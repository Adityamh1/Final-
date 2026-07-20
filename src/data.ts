import { Listing } from './types';

// महाराष्ट्रातील सर्व ३६ जिल्ह्यांची यादी (मराठीत)
export const MAHARASHTRA_DISTRICTS = [
  'पुणे',
  'नाशिक',
  'कोल्हापूर',
  'सातारा',
  'अहमदनगर',
  'सोलापूर',
  'सांगली',
  'छत्रपती संभाजीनगर',
  'नागपूर',
  'ठाणे',
  'जळगाव',
  'धुळे',
  'नंदुरबार',
  'बुलढाणा',
  'अकोला',
  'वाशीम',
  'अमरावती',
  'यवतमाळ',
  'वर्धा',
  'भंडारा',
  'गोंदिया',
  'चंद्रपूर',
  'गडचिरोली',
  'जालना',
  'परभणी',
  'हिंगोली',
  'नांदेड',
  'लातूर',
  'बीड',
  'धाराशिव',
  'रायगड',
  'रत्नागिरी',
  'सिंधुदुर्ग',
  'पालघर',
  'मुंबई उपनगर',
  'मुंबई शहर'
].sort((a, b) => a.localeCompare(b, 'mr'));

// पूर्व-निर्धारित जाहिराती (Preseeded High-Quality Listings)
export const SEED_LISTINGS: Listing[] = [
  {
    id: 'seed-1',
    category: 'cow',
    breed: 'गीर गाय (Gir Cow)',
    price: 65000,
    age: '३ वर्षे (पहिले वेत)',
    location: 'मंचर, आंबेगाव तालुका',
    district: 'पुणे',
    photo: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80',
    sellerName: 'ज्ञानेश्वर कडू',
    phone: '9876543210',
    hidePhone: true,
    details: 'अतिशय शांत स्वभावाची गीर गाय आहे. रोज दोन्ही वेळेचे मिळून ८ ते १० लिटर दूध देते. तब्येत निरोगी असून सर्व लसीकरण पूर्ण झाले आहे.',
    milkCapacity: '१० लिटर रोज',
    createdAt: '१५ जुलै २०२६'
  },
  {
    id: 'seed-2',
    category: 'buffalo',
    breed: 'जाफ्राबादी म्हैस (Jafrabadi Buffalo)',
    price: 95000,
    age: '४ वर्षे (दुसरे वेत)',
    location: 'चांदवड',
    district: 'नाशिक',
    photo: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800&auto=format&fit=crop&q=80',
    sellerName: 'बाळासाहेब पाटील',
    phone: '9422001122',
    details: 'उंच आणि मजबूत बांध्याची जाफ्राबादी म्हैस विकणे आहे. सध्या रोज १२ लिटर दूध चालू आहे. फॅट प्रमाण ६.५+ आहे. चारा व्यवस्थित खाते.',
    milkCapacity: '१२ लिटर रोज',
    createdAt: '१४ जुलै २०२६'
  },
  {
    id: 'seed-3',
    category: 'dog',
    breed: 'लॅब्राडोर पिल्लू (Labrador Puppy)',
    price: 12000,
    age: '४५ दिवस',
    location: 'शाहूपुरी',
    district: 'कोल्हापूर',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
    sellerName: 'राहुल माने',
    phone: '8888777766',
    hidePhone: true,
    details: 'प्युअर ब्रीड लॅब्राडोर नर पिल्लू विकणे आहे. अतिशय हुशार, ॲक्टिव्ह आणि निरोगी आहे. डीवॉर्मिंग (Deworming) पूर्ण केले आहे.',
    gender: 'नर',
    createdAt: '१६ जुलै २०२६'
  },
  {
    id: 'seed-4',
    category: 'cow',
    breed: 'खिलार खिलारी गाय (Khillar Cow)',
    price: 52000,
    age: '२ वर्षे ६ महिने',
    location: 'कराड जवळ',
    district: 'सातारा',
    photo: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=80',
    sellerName: 'सदाशिव मोहिते',
    phone: '9921345678',
    details: 'शुद्ध खिलार जातीची सुंदर कालवड/गाय. अंगाने चपळ आणि निरोगी आहे. घरगुती संगोपन केलेले आहे. किमतीत थोडी तडजोड होईल.',
    milkCapacity: '४ लिटर रोज',
    createdAt: '१३ जुलै २०२६'
  },
  {
    id: 'seed-5',
    category: 'buffalo',
    breed: 'मुर्रा म्हैस (Murrah Buffalo)',
    price: 110000,
    age: '५ वर्षे (तिसरे वेत)',
    location: 'राहुरी',
    district: 'अहमदनगर',
    photo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    sellerName: 'रामचंद्र डोंगरे',
    phone: '7766554433',
    details: 'काळ्या कुळकुळीत रंगाची शुद्ध मुर्रा म्हैस विकणे आहे. दूध काढण्यास अत्यंत सोपी आणि शांत आहे. सध्या दिवसाला १४ लिटर दूध देत आहे.',
    milkCapacity: '१४ लिटर रोज',
    createdAt: '१२ जुलै २०२६'
  },
  {
    id: 'seed-6',
    category: 'dog',
    breed: 'जर्मन शेफर्ड (German Shepherd)',
    price: 15000,
    age: '३ महिने',
    location: 'वडगाव शेरी',
    district: 'पुणे',
    photo: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&auto=format&fit=crop&q=80',
    sellerName: 'अमित साळुंखे',
    phone: '9011223344',
    details: 'डबल कोट जर्मन शेफर्ड मादी पिल्लू विक्रीसाठी उपलब्ध. पहिल्या डोसचे लसीकरण (Vaccination) पूर्ण झाले आहे. आरोग्याचे कार्ड सोबत दिले जाईल.',
    gender: 'मादी',
    createdAt: '१६ जुलै २०२६'
  },
  {
    id: 'seed-7',
    category: 'hen',
    breed: 'गावरान गावरान कोंबडी (Gavran Hen)',
    price: 450,
    age: '६ महिने',
    location: 'संगमनेर',
    district: 'अहमदनगर',
    photo: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=80',
    sellerName: 'भास्कर थोरात',
    phone: '9822454567',
    details: 'गावरान जातीची अत्यंत निरोगी कोंबडी आहे. नैसर्गिक खाद्य खाल्लेली आहे. अंडी देण्यास सुरुवात झालेली आहे. एकूण १० कोंबड्या शिल्लक आहेत.',
    createdAt: '१६ जुलै २०२६'
  },
  {
    id: 'seed-8',
    category: 'egg',
    breed: 'सेंद्रिय गावरान अंडी (Gavran Eggs)',
    price: 12,
    age: 'ताजी अंडी',
    location: 'तासगाव',
    district: 'सांगली',
    photo: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800&auto=format&fit=crop&q=80',
    sellerName: 'संजय पाटील',
    phone: '9850123456',
    details: 'प्युअर गावरान गावठी अंडी प्रति नग १२ रुपये दराने मिळतील. हॅचिंग किंवा खाण्यासाठी उत्तम दर्जाची अंडी आहेत. मोठी ऑर्डर असल्यास मोफत डिलिव्हरी होईल.',
    createdAt: '१५ जुलै २०२६'
  },
  {
    id: 'seed-9',
    category: 'hen',
    breed: 'कडकनाथ कोंबडा (Kadaknath Cock)',
    price: 800,
    age: '८ महिने',
    location: 'उदगीर',
    district: 'लातूर',
    photo: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=800&auto=format&fit=crop&q=80',
    sellerName: 'रफीक शेख',
    phone: '9923112233',
    details: 'अस्सल कडकनाथ जातीचा काळा कुळकुळीत कोंबडा वजन साधारण २.५ किलो आहे. अतिशय चपळ आणि उत्तम आरोग्याचा आहे.',
    createdAt: '१६ जुलै २०२६'
  },
  {
    id: 'seed-10',
    category: 'manure',
    breed: 'प्युअर शेणखत (Pure Cow Dung Manure)',
    price: 2500,
    age: 'प्रति ट्रॉली (Per Trolley)',
    location: 'बारामती',
    district: 'पुणे',
    photo: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=800&auto=format&fit=crop&q=80',
    sellerName: 'हनुमंतराव जगताप',
    phone: '9822334455',
    details: 'उत्तम कुजलेले सेंद्रिय शेणखत ट्रॅक्टर ट्रॉली दराने मिळेल. पिकांसाठी अत्यंत फायदेशीर आणि कसदार खत आहे. स्वतःच्या गोठ्यातील आहे.',
    createdAt: '१६ जुलै २०२६'
  },
  {
    id: 'seed-11',
    category: 'fodder',
    breed: 'हिरवा मका चारा (Green Maize Fodder)',
    price: 15000,
    age: 'प्रति एकर (Per Acre)',
    location: 'मंचर',
    district: 'पुणे',
    photo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    sellerName: 'ज्ञानेश्वर वाळुंज',
    phone: '9422001122',
    details: 'उंच वाढलेली, रसरशीत आणि गोड मका चारा एकरच्या हिशोबाने विक्रीसाठी उपलब्ध आहे. दुभत्या जनावरांसाठी उत्कृष्ट चारा आहे. कापणी स्वतः करावी लागेल.',
    createdAt: '१६ जुलै २०२६'
  }
];

// प्राण्यांची चित्रे (Default placeholder options for users who don't have a photo)
export const DEFAULT_ANIMAL_PHOTOS = {
  cow: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80',
  buffalo: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800&auto=format&fit=crop&q=80',
  dog: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&auto=format&fit=crop&q=80',
  hen: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=80',
  egg: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800&auto=format&fit=crop&q=80',
  manure: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=800&auto=format&fit=crop&q=80',
  fodder: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80'
};

// महाराष्ट्रातील प्रादेशिक विभाग (Maharashtra Regional Divisions)
export const MAHARASHTRA_REGIONS: Record<string, string[]> = {
  'पश्चिम महाराष्ट्र': ['पुणे', 'सातारा', 'सांगली', 'कोल्हापूर', 'सोलापूर'],
  'उत्तर महाराष्ट्र': ['नाशिक', 'अहमदनगर', 'जळगाव', 'धुळे', 'नंदुरबार'],
  'मराठवाडा': ['छत्रपती संभाजीनगर', 'जालना', 'परभणी', 'हिंगोली', 'नांदेड', 'लातूर', 'बीड', 'धाराशिव'],
  'विदर्भ': ['नागपूर', 'वर्धा', 'भंडारा', 'गोंदिया', 'चंद्रपूर', 'गडचिरोली', 'अकोला', 'अमरावती', 'यवतमाळ', 'वाशीम', 'बुलढाणा'],
  'कोकण': ['ठाणे', 'पालघर', 'रायगड', 'रत्नागिरी', 'सिंधुदुर्ग', 'मुंबई उपनगर', 'मुंबई शहर']
};

export function getRegionForDistrict(district: string): string {
  for (const [region, districts] of Object.entries(MAHARASHTRA_REGIONS)) {
    if (districts.includes(district)) {
      return region;
    }
  }
  return '';
}

export function getNearbyDistricts(district: string): string[] {
  for (const districts of Object.values(MAHARASHTRA_REGIONS)) {
    if (districts.includes(district)) {
      return districts.filter(d => d !== district);
    }
  }
  return [];
}

