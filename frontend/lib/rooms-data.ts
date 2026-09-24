import { RoomClassification, Room, Booking, PaymentTransaction, RateType, PaymentMethod, RoomStatus } from "@/types";

export const INITIAL_CLASSIFICATIONS: RoomClassification[] = [
  {
    id: "class-std",
    name: "Standard Executive Room",
    code: "STD",
    tagline: "Contemporary Comfort & Refined Simplicity",
    description: "Designed for business travelers and short-stay leisure guests featuring ergonomic workspace, premium plush bedding, and high-speed fiber internet.",
    dailyRate: 120, // $120 / day
    hourlyRate: 20, // $20 / hr (e.g. 3h = $60)
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
    dailyRate: 190, // $190 / day
    hourlyRate: 32, // $32 / hr
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
    dailyRate: 340, // $340 / day
    hourlyRate: 55, // $55 / hr
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
    dailyRate: 750, // $750 / day
    hourlyRate: 120, // $120 / hr
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
    dailyRate: 480, // $480 / day
    hourlyRate: 80, // $80 / hr
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
    guestPhone: "+1 (555) 019-2834",
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
    baseAmount: 360,
    taxAmount: 43.2,
    serviceCharge: 18,
    totalAmount: 421.2,
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
    guestPhone: "+1 (555) 014-3882",
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
    baseAmount: 120,
    taxAmount: 14.4,
    serviceCharge: 6,
    totalAmount: 140.4,
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
    guestPhone: "+1 (555) 018-8472",
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
    baseAmount: 570,
    taxAmount: 68.4,
    serviceCharge: 28.5,
    totalAmount: 666.9,
    status: "checked_in",
    paymentStatus: "paid",
    paymentId: "txn-003",
    paymentMethod: "credit_card",
    cardLast4: "8891",
    createdAt: "2026-09-21T11:20:00Z",
    updatedAt: "2026-09-22T15:15:00Z",
  },
  {
    id: "bkg-004",
    referenceCode: "CJH-BK-91830",
    guestName: "Lord Alistair Sterling",
    guestEmail: "alistair.sterling@estates.co.uk",
    guestPhone: "+44 20 7946 0999",
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
    baseAmount: 4500,
    taxAmount: 540,
    serviceCharge: 225,
    totalAmount: 5265,
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
    guestPhone: "+1 (555) 013-9941",
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
    baseAmount: 330,
    taxAmount: 39.6,
    serviceCharge: 16.5,
    totalAmount: 386.1,
    status: "confirmed",
    paymentStatus: "paid",
    paymentId: "txn-005",
    paymentMethod: "paypal",
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
    amount: 421.2,
    currency: "USD",
    paymentMethod: "credit_card",
    cardBrand: "Visa",
    cardLast4: "4242",
    status: "completed",
    authCode: "AUTH-891238",
    transactionDate: "2026-09-23T14:05:00Z",
    breakdown: { roomSubtotal: 360, taxes: 43.2, serviceFee: 18, total: 421.2 },
  },
  {
    id: "txn-002",
    receiptNumber: "REC-2026-00892",
    bookingId: "bkg-002",
    bookingRef: "CJH-BK-91824",
    guestName: "Elena Rostova",
    guestEmail: "elena.rostova@designworks.io",
    amount: 140.4,
    currency: "USD",
    paymentMethod: "gcash",
    status: "completed",
    authCode: "GCASH-829103",
    transactionDate: "2026-09-24T10:02:00Z",
    breakdown: { roomSubtotal: 120, taxes: 14.4, serviceFee: 6, total: 140.4 },
  },
  {
    id: "txn-003",
    receiptNumber: "REC-2026-00893",
    bookingId: "bkg-003",
    bookingRef: "CJH-BK-91825",
    guestName: "Marcus Sterling",
    guestEmail: "m.sterling@globalventure.com",
    amount: 666.9,
    currency: "USD",
    paymentMethod: "credit_card",
    cardBrand: "Mastercard",
    cardLast4: "8891",
    status: "completed",
    authCode: "AUTH-332901",
    transactionDate: "2026-09-22T15:10:00Z",
    breakdown: { roomSubtotal: 570, taxes: 68.4, serviceFee: 28.5, total: 666.9 },
  },
  {
    id: "txn-004",
    receiptNumber: "REC-2026-00894",
    bookingId: "bkg-004",
    bookingRef: "CJH-BK-91830",
    guestName: "Lord Alistair Sterling",
    guestEmail: "alistair.sterling@estates.co.uk",
    amount: 5265,
    currency: "USD",
    paymentMethod: "credit_card",
    cardBrand: "American Express",
    cardLast4: "1004",
    status: "completed",
    authCode: "AUTH-999812",
    transactionDate: "2026-09-21T13:02:00Z",
    breakdown: { roomSubtotal: 4500, taxes: 540, serviceFee: 225, total: 5265 },
  },
  {
    id: "txn-005",
    receiptNumber: "REC-2026-00895",
    bookingId: "bkg-005",
    bookingRef: "CJH-BK-91831",
    guestName: "Alexander Wright",
    guestEmail: "alex.wright@techsummit.org",
    amount: 386.1,
    currency: "USD",
    paymentMethod: "paypal",
    status: "completed",
    authCode: "PP-7718290",
    transactionDate: "2026-09-24T12:04:00Z",
    breakdown: { roomSubtotal: 330, taxes: 39.6, serviceFee: 16.5, total: 386.1 },
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

export function calculateCost(classification: RoomClassification, rateType: RateType, duration: number) {
  const unitRate = rateType === "daily" ? classification.dailyRate : classification.hourlyRate;
  const baseAmount = unitRate * duration;
  const taxAmount = Math.round(baseAmount * 0.12 * 100) / 100; // 12% tax
  const serviceCharge = Math.round(baseAmount * 0.05 * 100) / 100; // 5% service fee
  const totalAmount = Math.round((baseAmount + taxAmount + serviceCharge) * 100) / 100;

  return { unitRate, baseAmount, taxAmount, serviceCharge, totalAmount };
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
  paymentMethod: PaymentMethod;
  cardBrand?: string;
  cardLast4?: string;
  breakdown: PaymentTransaction["breakdown"];
}): PaymentTransaction {
  const transactions = getTransactions();
  const randomRef = Math.floor(100000 + Math.random() * 900000);
  const newTxn: PaymentTransaction = {
    id: `txn-${Date.now()}`,
    receiptNumber: `REC-${new Date().getFullYear()}-${randomRef}`,
    bookingId: paymentData.bookingId,
    bookingRef: paymentData.bookingRef,
    guestName: paymentData.guestName,
    guestEmail: paymentData.guestEmail,
    amount: paymentData.amount,
    currency: "USD",
    paymentMethod: paymentData.paymentMethod,
    cardBrand: paymentData.cardBrand,
    cardLast4: paymentData.cardLast4,
    status: "completed",
    authCode: `AUTH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
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
  if (typeof window === "undefined") return "USD";
  return (localStorage.getItem(STORAGE_KEYS.CURRENCY) as "USD" | "PHP") || "USD";
}

export function setCurrency(c: "USD" | "PHP"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CURRENCY, c);
}

export function formatCurrency(amountUSD: number, currency?: "USD" | "PHP"): string {
  const curr = currency || (typeof window !== "undefined" ? getCurrency() : "USD");
  if (curr === "PHP") {
    // 1 USD ~ 56 PHP
    const phpAmount = Math.round(amountUSD * 56);
    return `₱${phpAmount.toLocaleString("en-PH")}`;
  }
  return `$${amountUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
