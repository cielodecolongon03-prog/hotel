import { RoomClassification, Room, Booking, PaymentTransaction, RateType, PaymentMethod, RoomStatus, ConciergeAddOn } from "@/types";

export const CONCIERGE_ADDONS: ConciergeAddOn[] = [
  {
    id: "addon-chauffeur",
    name: "NAIA Airport Luxury Chauffeur Transfer",
    category: "transfer",
    pricePHP: 1800,
    description: "Private Mercedes-Benz / Alphard executive airport greeting and transfer directly to Crown Jewel.",
    iconName: "Car",
  },
  {
    id: "addon-spa",
    name: "Pearl Imperial Hilot & Aromatherapy (90 min)",
    category: "wellness",
    pricePHP: 3200,
    description: "Award-winning Philippine traditional hot stone hilot wellness treatment at Crown Spa.",
    iconName: "Sparkles",
  },
  {
    id: "addon-breakfast",
    name: "Grand Gourmet Champagne Buffet Breakfast",
    category: "dining",
    pricePHP: 1450,
    description: "Daily international & Filipino breakfast buffet with fresh tropical fruits, pastries, and mimosa.",
    iconName: "Utensils",
  },
  {
    id: "addon-wifi",
    name: "Ultra Fiber Gigabit VIP Streaming WiFi",
    category: "convenience",
    pricePHP: 500,
    description: "Dedicated 1 Gbps unthrottled priority connection ideal for executive videoconferencing.",
    iconName: "Wifi",
  },
  {
    id: "addon-romance",
    name: "Crown Romance Suite Floral & Wine Setup",
    category: "wellness",
    pricePHP: 2500,
    description: "Handcrafted Ecuadorian roses, assorted artisan chocolate pralines, and chilled sparkling wine.",
    iconName: "Heart",
  },
];

export const INITIAL_CLASSIFICATIONS: RoomClassification[] = [
  {
    id: "class-std",
    name: "Standard Executive Room",
    code: "STD",
    tagline: "Contemporary Comfort & Refined Simplicity",
    description: "Designed for business travelers and short-stay leisure guests featuring ergonomic workspace, premium plush bedding, and high-speed fiber internet.",
    dailyRate: 3800, // ₱3,800 / day
    hourlyRate: 650, // ₱650 / hr (min 3h = ₱1,950)
    minHours: 3,
    capacity: 2,
    bedType: "1 Queen Bed",
    sizeSqM: 32,
    floorLevel: "Floors 2 - 3",
    amenities: ["Fiber High-Speed WiFi", "Ergonomic Workstation", "43\" 4K Smart TV", "Rain Shower", "Complimentary Bottled Water", "In-room Safe"],
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
    badge: "Popular for Business",
    totalRooms: 12,
  },
  {
    id: "class-dlx",
    name: "Deluxe Haven Suite",
    code: "DLX",
    tagline: "Spacious Elegance with Panoramic Garden Views",
    description: "Immerse yourself in elevated luxury with our Deluxe Room featuring a private terrace balcony, designer bath products, and an artisan coffee station.",
    dailyRate: 6500, // ₱6,500 / day
    hourlyRate: 1100, // ₱1,100 / hr
    minHours: 3,
    capacity: 3,
    bedType: "1 California King or 2 Twins",
    sizeSqM: 45,
    floorLevel: "Floors 3 - 4",
    amenities: ["Private Balcony", "Nespresso Machine", "55\" OLED Smart TV", "Luxury Bathrobes & Slippers", "Marble Bathroom", "Mini Bar Selection", "24/7 Room Service"],
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
    badge: "Guest Favorite",
    totalRooms: 16,
  },
  {
    id: "class-exe",
    name: "Crown Royal Executive Suite",
    code: "EXE",
    tagline: "Exclusive Skyline Luxury & Executive Lounge Access",
    description: "Opulent living space with separate lounge area, oversized soaking tub, VIP welcome amenities, and complimentary access to the Crown Club Lounge.",
    dailyRate: 12500, // ₱12,500 / day
    hourlyRate: 2200, // ₱2,200 / hr
    minHours: 3,
    capacity: 4,
    bedType: "1 Master King + Sleeper Sofa",
    sizeSqM: 70,
    floorLevel: "Floors 5 - 6",
    amenities: ["Executive Lounge Access", "Deep Soaking Jacuzzi Tub", "Separate Living & Dining Area", "Complimentary High Tea & Cocktails", "65\" Soundbar Entertainment", "Shoeshine & Pressing Service"],
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
    badge: "VIP Choice",
    totalRooms: 8,
  },
  {
    id: "class-pen",
    name: "Presidential Imperial Penthouse",
    code: "PEN",
    tagline: "The Pinnacle of World-Class Opulence",
    description: "The crown jewel of our property. An extraordinary 150m² sanctuary boasting a private heated plunge pool, dedicated 24-hour butler service, and 360° horizon views.",
    dailyRate: 38000, // ₱38,000 / day
    hourlyRate: 6500, // ₱6,500 / hr
    minHours: 4,
    capacity: 6,
    bedType: "2 Master King Suites",
    sizeSqM: 150,
    floorLevel: "Top Penthouse Floor (Level 7)",
    amenities: ["Dedicated 24hr Private Butler", "Private Infinity Plunge Pool", "Full Chef's Kitchen & Wine Cellar", "Bang & Olufsen Audio", "Private Elevator Access", "Complimentary Airport Chauffeur"],
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80",
    badge: "Ultra Luxury",
    totalRooms: 2,
  },
  {
    id: "class-fam",
    name: "Grand Family Garden Villa",
    code: "FAM",
    tagline: "Serene Private Estate for Families & Groups",
    description: "An idyllic haven for families seeking privacy and relaxation, enveloped by lush tropical gardens with a private patio and family entertaining pavilion.",
    dailyRate: 22000, // ₱22,000 / day
    hourlyRate: 3800, // ₱3,800 / hr
    minHours: 4,
    capacity: 8,
    bedType: "1 King + 2 Queens + 2 Bunk Beds",
    sizeSqM: 120,
    floorLevel: "Garden Ground Villa Wing",
    amenities: ["Private Garden & BBQ Patio", "Children's Play Amenities", "Full Gourmet Kitchenette", "Two Full Marble Bathrooms", "Smart Home Automation", "Private Covered Carport"],
    imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80",
    badge: "Family Preferred",
    totalRooms: 4,
  },
];

export const INITIAL_ROOMS: Room[] = [
  { id: "rm-101", roomNumber: "101", classificationId: "class-std", classificationName: "Standard Executive Room", floor: 1, status: "occupied", currentGuest: { name: "Jonathan Vance", bookingId: "CJH-91823", rateType: "daily", checkIn: "2026-09-23", expectedCheckOut: "2026-09-26", phone: "+1 555-0192" }, cleaningStatus: "clean" },
  { id: "rm-102", roomNumber: "102", classificationId: "class-std", classificationName: "Standard Executive Room", floor: 1, status: "vacant", cleaningStatus: "clean" },
  { id: "rm-103", roomNumber: "103", classificationId: "class-std", classificationName: "Standard Executive Room", floor: 1, status: "occupied", currentGuest: { name: "Elena Rostova", bookingId: "CJH-91824", rateType: "hourly", checkIn: "2026-09-24 10:00", expectedCheckOut: "2026-09-24 16:00", phone: "+1 555-0143" }, cleaningStatus: "clean" },
  { id: "rm-104", roomNumber: "104", classificationId: "class-std", classificationName: "Standard Executive Room", floor: 1, status: "cleaning", cleaningStatus: "in_progress" },
  { id: "rm-201", roomNumber: "201", classificationId: "class-dlx", classificationName: "Deluxe Haven Suite", floor: 2, status: "occupied", currentGuest: { name: "Marcus Sterling", bookingId: "CJH-91825", rateType: "daily", checkIn: "2026-09-22", expectedCheckOut: "2026-09-25", phone: "+1 555-0188" }, cleaningStatus: "clean" },
  { id: "rm-202", roomNumber: "202", classificationId: "class-dlx", classificationName: "Deluxe Haven Suite", floor: 2, status: "vacant", cleaningStatus: "clean" },
  { id: "rm-203", roomNumber: "203", classificationId: "class-dlx", classificationName: "Deluxe Haven Suite", floor: 2, status: "occupied", currentGuest: { name: "Sophia Chen", bookingId: "CJH-91826", rateType: "daily", checkIn: "2026-09-24", expectedCheckOut: "2026-09-27", phone: "+1 555-0176" }, cleaningStatus: "clean" },
  { id: "rm-204", roomNumber: "204", classificationId: "class-dlx", classificationName: "Deluxe Haven Suite", floor: 2, status: "maintenance", maintenanceNotes: "AC condenser coil inspection", cleaningStatus: "needs_cleaning" },
  { id: "rm-301", roomNumber: "301", classificationId: "class-exe", classificationName: "Crown Royal Executive Suite", floor: 3, status: "occupied", currentGuest: { name: "David K. Harrison", bookingId: "CJH-91827", rateType: "daily", checkIn: "2026-09-23", expectedCheckOut: "2026-09-28", phone: "+1 555-0199" }, cleaningStatus: "clean" },
  { id: "rm-302", roomNumber: "302", classificationId: "class-exe", classificationName: "Crown Royal Executive Suite", floor: 3, status: "vacant", cleaningStatus: "clean" },
  { id: "rm-305", roomNumber: "305", classificationId: "class-exe", classificationName: "Crown Royal Executive Suite", floor: 3, status: "occupied", currentGuest: { name: "Amelia Dupont", bookingId: "CJH-91828", rateType: "hourly", checkIn: "2026-09-24 12:00", expectedCheckOut: "2026-09-24 18:00", phone: "+1 555-0155" }, cleaningStatus: "clean" },
  { id: "rm-401", roomNumber: "401", classificationId: "class-fam", classificationName: "Grand Family Garden Villa", floor: 4, status: "vacant", cleaningStatus: "clean" },
  { id: "rm-402", roomNumber: "402", classificationId: "class-fam", classificationName: "Grand Family Garden Villa", floor: 4, status: "occupied", currentGuest: { name: "Robert & Laura Taylor", bookingId: "CJH-91829", rateType: "daily", checkIn: "2026-09-20", expectedCheckOut: "2026-09-26", phone: "+1 555-0111" }, cleaningStatus: "clean" },
  { id: "rm-501", roomNumber: "501", classificationId: "class-pen", classificationName: "Presidential Imperial Penthouse", floor: 5, status: "vacant", cleaningStatus: "clean" },
  { id: "rm-502", roomNumber: "502", classificationId: "class-pen", classificationName: "Presidential Imperial Penthouse", floor: 5, status: "occupied", currentGuest: { name: "Lord Alistair Sterling", bookingId: "CJH-91830", rateType: "daily", checkIn: "2026-09-21", expectedCheckOut: "2026-09-27", phone: "+1 555-0999" }, cleaningStatus: "clean" },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "bkg-001",
    referenceCode: "CJH-BK-91823",
    guestName: "Jonathan Vance",
    guestEmail: "j.vance@financialcorp.com",
    guestPhone: "+63 917 892 2834",
    roomNumber: "101",
    classificationId: "class-std",
    classificationName: "Standard Executive Room",
    rateType: "daily",
    duration: 3,
    checkInDate: "2026-09-23",
    checkInTime: "14:00",
    checkOutDate: "2026-09-26",
    checkOutTime: "11:00",
    numberOfGuests: 1,
    baseAmount: 11400,
    taxAmount: 1368,
    serviceCharge: 1140,
    totalAmount: 13908,
    specialRequests: "Quiet corner room, high floor if possible.",
    status: "checked_in",
    paymentStatus: "paid",
    paymentId: "txn-001",
    paymentMethod: "credit_card",
    cardLast4: "4242",
    createdAt: "2026-09-22T08:30:00Z",
    updatedAt: "2026-09-23T14:10:00Z",
  },
  {
    id: "bkg-002",
    referenceCode: "CJH-BK-91824",
    guestName: "Elena Rostova",
    guestEmail: "elena.rostova@designworks.io",
    guestPhone: "+63 918 554 3882",
    roomNumber: "103",
    classificationId: "class-std",
    classificationName: "Standard Executive Room",
    rateType: "hourly",
    duration: 6,
    checkInDate: "2026-09-24",
    checkInTime: "10:00",
    checkOutDate: "2026-09-24",
    checkOutTime: "16:00",
    numberOfGuests: 2,
    baseAmount: 3900,
    taxAmount: 468,
    serviceCharge: 390,
    totalAmount: 4758,
    specialRequests: "Quiet workstation for international video conference.",
    status: "checked_in",
    paymentStatus: "paid",
    paymentId: "txn-002",
    paymentMethod: "gcash",
    createdAt: "2026-09-24T09:15:00Z",
    updatedAt: "2026-09-24T10:05:00Z",
  },
  {
    id: "bkg-003",
    referenceCode: "CJH-BK-91825",
    guestName: "Marcus Sterling",
    guestEmail: "m.sterling@globalventure.com",
    guestPhone: "+63 920 448 8472",
    roomNumber: "201",
    classificationId: "class-dlx",
    classificationName: "Deluxe Haven Suite",
    rateType: "daily",
    duration: 3,
    checkInDate: "2026-09-22",
    checkInTime: "15:00",
    checkOutDate: "2026-09-25",
    checkOutTime: "12:00",
    numberOfGuests: 2,
    baseAmount: 19500,
    taxAmount: 2340,
    serviceCharge: 1950,
    totalAmount: 23790,
    status: "checked_in",
    paymentStatus: "paid",
    paymentId: "txn-003",
    paymentMethod: "maya",
    createdAt: "2026-09-21T11:20:00Z",
    updatedAt: "2026-09-22T15:15:00Z",
  },
  {
    id: "bkg-004",
    referenceCode: "CJH-BK-91830",
    guestName: "Lord Alistair Sterling",
    guestEmail: "alistair.sterling@estates.co.uk",
    guestPhone: "+63 905 111 0999",
    roomNumber: "502",
    classificationId: "class-pen",
    classificationName: "Presidential Imperial Penthouse",
    rateType: "daily",
    duration: 6,
    checkInDate: "2026-09-21",
    checkInTime: "13:00",
    checkOutDate: "2026-09-27",
    checkOutTime: "14:00",
    numberOfGuests: 4,
    baseAmount: 228000,
    taxAmount: 27360,
    serviceCharge: 22800,
    totalAmount: 278160,
    specialRequests: "Vintage Champagne in wine cellar on arrival; 24h butler service.",
    status: "checked_in",
    paymentStatus: "paid",
    paymentId: "txn-004",
    paymentMethod: "credit_card",
    cardLast4: "1004",
    createdAt: "2026-09-15T10:00:00Z",
    updatedAt: "2026-09-21T13:00:00Z",
  },
  {
    id: "bkg-005",
    referenceCode: "CJH-BK-91831",
    guestName: "Alexander Wright",
    guestEmail: "alex.wright@techsummit.org",
    guestPhone: "+63 928 903 9941",
    roomNumber: "302",
    classificationId: "class-exe",
    classificationName: "Crown Royal Executive Suite",
    rateType: "hourly",
    duration: 6,
    checkInDate: "2026-09-25",
    checkInTime: "13:00",
    checkOutDate: "2026-09-25",
    checkOutTime: "19:00",
    numberOfGuests: 2,
    baseAmount: 13200,
    taxAmount: 1584,
    serviceCharge: 1320,
    totalAmount: 16104,
    status: "confirmed",
    paymentStatus: "paid",
    paymentId: "txn-005",
    paymentMethod: "grabpay",
    createdAt: "2026-09-24T12:00:00Z",
    updatedAt: "2026-09-24T12:05:00Z",
  },
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: "txn-001",
    receiptNumber: "REC-2026-00891",
    bookingId: "bkg-001",
    bookingRef: "CJH-BK-91823",
    guestName: "Jonathan Vance",
    guestEmail: "j.vance@financialcorp.com",
    amount: 13908,
    currency: "PHP",
    paymentMethod: "credit_card",
    cardBrand: "Visa",
    cardLast4: "4242",
    status: "completed",
    authCode: "AUTH-891238",
    transactionDate: "2026-09-23T14:05:00Z",
    breakdown: { roomSubtotal: 11400, taxes: 1368, serviceFee: 1140, total: 13908 },
  },
  {
    id: "txn-002",
    receiptNumber: "REC-2026-00892",
    bookingId: "bkg-002",
    bookingRef: "CJH-BK-91824",
    guestName: "Elena Rostova",
    guestEmail: "elena.rostova@designworks.io",
    amount: 4758,
    currency: "PHP",
    paymentMethod: "gcash",
    status: "completed",
    authCode: "GCASH-82910381",
    transactionDate: "2026-09-24T10:02:00Z",
    breakdown: { roomSubtotal: 3900, taxes: 468, serviceFee: 390, total: 4758 },
  },
  {
    id: "txn-003",
    receiptNumber: "REC-2026-00893",
    bookingId: "bkg-003",
    bookingRef: "CJH-BK-91825",
    guestName: "Marcus Sterling",
    guestEmail: "m.sterling@globalventure.com",
    amount: 23790,
    currency: "PHP",
    paymentMethod: "maya",
    status: "completed",
    authCode: "MAYA-33290192",
    transactionDate: "2026-09-22T15:10:00Z",
    breakdown: { roomSubtotal: 19500, taxes: 2340, serviceFee: 1950, total: 23790 },
  },
  {
    id: "txn-004",
    receiptNumber: "REC-2026-00894",
    bookingId: "bkg-004",
    bookingRef: "CJH-BK-91830",
    guestName: "Lord Alistair Sterling",
    guestEmail: "alistair.sterling@estates.co.uk",
    amount: 278160,
    currency: "PHP",
    paymentMethod: "credit_card",
    cardBrand: "American Express",
    cardLast4: "1004",
    status: "completed",
    authCode: "AUTH-999812",
    transactionDate: "2026-09-21T13:02:00Z",
    breakdown: { roomSubtotal: 228000, taxes: 27360, serviceFee: 22800, total: 278160 },
  },
  {
    id: "txn-005",
    receiptNumber: "REC-2026-00895",
    bookingId: "bkg-005",
    bookingRef: "CJH-BK-91831",
    guestName: "Alexander Wright",
    guestEmail: "alex.wright@techsummit.org",
    amount: 16104,
    currency: "PHP",
    paymentMethod: "grabpay",
    status: "completed",
    authCode: "GRAB-7718290",
    transactionDate: "2026-09-24T12:04:00Z",
    breakdown: { roomSubtotal: 13200, taxes: 1584, serviceFee: 1320, total: 16104 },
  },
];

// LocalStorage helpers
const STORAGE_KEYS = {
  CLASSIFICATIONS: "cjh_classifications",
  ROOMS: "cjh_rooms",
  BOOKINGS: "cjh_bookings",
  TRANSACTIONS: "cjh_transactions",
  CURRENCY: "cjh_currency",
};

export function getClassifications(): RoomClassification[] {
  if (typeof window === "undefined") return INITIAL_CLASSIFICATIONS;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CLASSIFICATIONS);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading classifications:", e);
  }
  return INITIAL_CLASSIFICATIONS;
}

export function saveClassifications(data: RoomClassification[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.CLASSIFICATIONS, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving classifications:", e);
  }
}

export function updateClassificationRates(id: string, dailyRate: number, hourlyRate: number): RoomClassification[] {
  const current = getClassifications();
  const updated = current.map((c) => (c.id === id ? { ...c, dailyRate, hourlyRate } : c));
  saveClassifications(updated);
  return updated;
}

export function getRooms(): Room[] {
  if (typeof window === "undefined") return INITIAL_ROOMS;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ROOMS);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading rooms:", e);
  }
  return INITIAL_ROOMS;
}

export function saveRooms(data: Room[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving rooms:", e);
  }
}

export function updateRoomStatus(roomNumber: string, status: RoomStatus, guestInfo?: Room["currentGuest"]): Room[] {
  const current = getRooms();
  const updated = current.map((r) => {
    if (r.roomNumber === roomNumber) {
      return {
        ...r,
        status,
        currentGuest: status === "vacant" ? undefined : (guestInfo || r.currentGuest),
        cleaningStatus: status === "cleaning" ? "in_progress" : status === "vacant" ? "clean" : r.cleaningStatus,
      };
    }
    return r;
  });
  saveRooms(updated);
  return updated;
}

export function getBookings(): Booking[] {
  if (typeof window === "undefined") return INITIAL_BOOKINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading bookings:", e);
  }
  return INITIAL_BOOKINGS;
}

export function saveBookings(data: Booking[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving bookings:", e);
  }
}

export function getBookingByCode(code: string): Booking | undefined {
  const bookings = getBookings();
  const clean = code.trim().toUpperCase();
  return bookings.find((b) => b.referenceCode.toUpperCase() === clean || b.id.toUpperCase() === clean || b.roomNumber === clean);
}

export function calculateCost(
  classification: RoomClassification,
  rateType: RateType,
  duration: number,
  addOnsTotal: number = 0
) {
  const unitRate = rateType === "daily" ? classification.dailyRate : classification.hourlyRate;
  const baseAmount = unitRate * duration;
  const taxableSubtotal = baseAmount + addOnsTotal;
  const taxAmount = Math.round(taxableSubtotal * 0.12 * 100) / 100; // 12% Philippine VAT
  const serviceCharge = Math.round(taxableSubtotal * 0.10 * 100) / 100; // 10% Hotel Service Charge
  const totalAmount = Math.round((taxableSubtotal + taxAmount + serviceCharge) * 100) / 100;

  return { unitRate, baseAmount, addOnsTotal, taxAmount, serviceCharge, totalAmount };
}

export function createBooking(data: Omit<Booking, "id" | "referenceCode" | "createdAt" | "updatedAt">): Booking {
  const bookings = getBookings();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const newBooking: Booking = {
    ...data,
    id: `bkg-${Date.now()}`,
    referenceCode: `CJH-BK-${randomNum}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newBooking, ...bookings];
  saveBookings(updated);

  // If status is checked_in or confirmed with room, update room status
  if (newBooking.roomNumber) {
    updateRoomStatus(newBooking.roomNumber, "occupied", {
      name: newBooking.guestName,
      bookingId: newBooking.referenceCode,
      rateType: newBooking.rateType,
      checkIn: `${newBooking.checkInDate} ${newBooking.checkInTime}`,
      expectedCheckOut: `${newBooking.checkOutDate} ${newBooking.checkOutTime}`,
      phone: newBooking.guestPhone,
    });
  }

  return newBooking;
}

export function getTransactions(): PaymentTransaction[] {
  if (typeof window === "undefined") return INITIAL_TRANSACTIONS;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading transactions:", e);
  }
  return INITIAL_TRANSACTIONS;
}

export function saveTransactions(data: PaymentTransaction[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving transactions:", e);
  }
}

export function recordPayment(paymentData: {
  bookingId: string;
  bookingRef: string;
  guestName: string;
  guestEmail: string;
  amount: number;
  currency?: "PHP" | "USD";
  paymentMethod: PaymentMethod;
  cardBrand?: string;
  cardLast4?: string;
  breakdown: PaymentTransaction["breakdown"];
}): PaymentTransaction {
  const transactions = getTransactions();
  const randomRef = Math.floor(100000 + Math.random() * 900000);
  const prefix = paymentData.paymentMethod === "gcash" ? "GCASH" :
                 paymentData.paymentMethod === "maya" ? "MAYA" :
                 paymentData.paymentMethod === "grabpay" ? "GRAB" :
                 paymentData.paymentMethod === "bdo" ? "BDO" :
                 paymentData.paymentMethod === "bpi" ? "BPI" :
                 paymentData.paymentMethod === "unionbank" ? "UBP" :
                 paymentData.paymentMethod === "cash" ? "CSH" : "AUTH";

  const newTxn: PaymentTransaction = {
    id: `txn-${Date.now()}`,
    receiptNumber: `REC-${new Date().getFullYear()}-${randomRef}`,
    bookingId: paymentData.bookingId,
    bookingRef: paymentData.bookingRef,
    guestName: paymentData.guestName,
    guestEmail: paymentData.guestEmail,
    amount: paymentData.amount,
    currency: paymentData.currency || "PHP",
    paymentMethod: paymentData.paymentMethod,
    cardBrand: paymentData.cardBrand,
    cardLast4: paymentData.cardLast4,
    status: "completed",
    authCode: `${prefix}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    transactionDate: new Date().toISOString(),
    breakdown: paymentData.breakdown,
  };

  const updatedTxns = [newTxn, ...transactions];
  saveTransactions(updatedTxns);

  // Update booking payment status
  const bookings = getBookings();
  const updatedBookings = bookings.map((b) =>
    b.id === paymentData.bookingId || b.referenceCode === paymentData.bookingRef
      ? { ...b, paymentStatus: "paid" as const, paymentId: newTxn.id, paymentMethod: paymentData.paymentMethod }
      : b
  );
  saveBookings(updatedBookings);

  return newTxn;
}

export function getCurrency(): "USD" | "PHP" {
  if (typeof window === "undefined") return "PHP";
  return (localStorage.getItem(STORAGE_KEYS.CURRENCY) as "USD" | "PHP") || "PHP";
}

export function setCurrency(c: "USD" | "PHP"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CURRENCY, c);
}

export function formatCurrency(amountPHP: number, currency?: "USD" | "PHP"): string {
  const curr = currency || (typeof window !== "undefined" ? getCurrency() : "PHP");
  if (curr === "USD") {
    // 1 USD ~ 56 PHP
    const usdAmount = amountPHP / 56;
    return `$${usdAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `₱${amountPHP.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
