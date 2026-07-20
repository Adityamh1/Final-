export type AnimalCategory = 'cow' | 'buffalo' | 'dog' | 'hen' | 'egg' | 'manure' | 'fodder';

export interface Listing {
  id: string;
  category: AnimalCategory;
  breed: string; // जात / वंश (e.g., खिलार, गीर, जाफ्राबादी, मुरुम, गावरान, लॅब्राडोर)
  price: number; // किंमत (रुपये)
  age: string; // वय (उदा. २ वर्षे, ५ महिने)
  location: string; // गाव / तालुका / पत्ता
  district: string; // जिल्हा
  photo: string; // फोटो (URL किंवा Base64 डेटा)
  sellerName: string; // विक्रेत्याचे नाव
  phone: string; // मोबाईल नंबर
  details: string; // इतर माहिती
  milkCapacity?: string; // दूध क्षमता (फक्त गाय/म्हैस साठी - optional)
  gender?: 'नर' | 'मादी'; // लिंग (प्रामुख्याने कुत्र्यांसाठी किंवा इतर)
  createdAt: string; // जाहिरात तारीख
  createdAtTime?: number; // मशिनी तारीख (मिलीसेकंदात) - स्वयंचलित ३० दिवस जुन्या जाहिराती काढण्यासाठी
  hidePhone?: boolean; // मोबाईल नंबर लपवायचा का
  isLocal?: boolean; // युझरने स्वतः टाकलेली जाहिरात आहे का
  isPremium?: boolean; // प्रीमियम जाहिरात आहे का
  deviceId?: string; // युझरचे युनिक डिवाइस आयडी (Firestore साठी)
}

export interface FilterOptions {
  category: AnimalCategory | 'all';
  district: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
}
