import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Droplets,
  Globe,
  House,
  Languages,
  Layers3,
  MessageCircleMore,
  PartyPopper,
  PhoneCall,
  Repeat,
  ShieldCheck,
  Sofa,
  Sparkles,
  Star,
  Truck,
  Users,
} from 'lucide-react';

type Locale = 'en' | 'ar';
type ServiceId =
  | 'home'
  | 'deep'
  | 'sofa'
  | 'curtain'
  | 'carpet'
  | 'office'
  | 'preEvent'
  | 'postEvent'
  | 'move'
  | 'regular'
  | 'custom';
type PropertyType = 'home' | 'office' | 'event';
type Translation = Record<Locale, string>;

interface ServiceDefinition {
  id: ServiceId;
  icon: LucideIcon;
  title: Translation;
  description: Translation;
  detail: Translation;
  startingFrom: number;
}

interface ProcessStep {
  icon: LucideIcon;
  title: Translation;
  description: Translation;
}

interface TrustPoint {
  icon: LucideIcon;
  title: Translation;
  description: Translation;
}

interface GalleryItem {
  title: Translation;
  description: Translation;
  before: Translation;
  after: Translation;
  themeClass: string;
}

interface Testimonial {
  quote: Translation;
  author: Translation;
  role: Translation;
}

interface EstimateFormState {
  name: string;
  phone: string;
  serviceType: ServiceId;
  propertyType: PropertyType;
  rooms: number;
  sofas: number;
  curtains: number;
  carpets: number;
  location: string;
  preferredDate: string;
  notes: string;
}

interface ContactFormState {
  name: string;
  phone: string;
  message: string;
}

interface EstimateResult {
  min: number;
  max: number;
}

const BUSINESS_DETAILS = {
  companyName: {
    en: 'Al-Iktisah Integrated Home Services Company',
    ar: 'شركة الإكتساح للخدمات المنزلية المتكاملة - طرابلس',
  },
  brandName: {
    en: 'Sweepy Home Services',
    ar: 'سويبي للخدمات المنزلية',
  },
  email: '',
  phoneDisplay: '+218 92 324 9449',
  phoneDigits: '218923249449',
  facebookUrl: 'https://www.facebook.com/share/1Dy6fH8ng1/',
  coFounder: {
    en: 'Ahmed Nouh',
    ar: 'أحمد نوح',
  },
  serviceArea: {
    en: 'Tripoli, Libya',
    ar: 'طرابلس، ليبيا',
  },
} as const;

const BRAND_LOGO_PATH = `${import.meta.env.BASE_URL}sweepy-logo.svg`;
const ABOUT_VIDEO_PATH = `${import.meta.env.BASE_URL}sweepy-about-video.mp4`;

const navigationItems = [
  { id: 'home', label: { en: 'Home', ar: 'الرئيسية' } },
  { id: 'services', label: { en: 'Services', ar: 'الخدمات' } },
  { id: 'process', label: { en: 'How it works', ar: 'طريقة العمل' } },
  { id: 'about', label: { en: 'About & Contact', ar: 'من نحن والتواصل' } },
  { id: 'estimate', label: { en: 'Estimate & Booking', ar: 'التقدير والحجز' } },
] as const;

type SectionId = (typeof navigationItems)[number]['id'];

const propertyTypeLabels: Record<PropertyType, Translation> = {
  home: { en: 'Home', ar: 'منزل' },
  office: { en: 'Office', ar: 'مكتب' },
  event: { en: 'Event', ar: 'مناسبة' },
};

const services: ServiceDefinition[] = [
  {
    id: 'home',
    icon: House,
    title: { en: 'Home cleaning', ar: 'تنظيف المنازل' },
    description: {
      en: 'Routine or one-time cleaning for apartments, villas, and family homes.',
      ar: 'تنظيف دوري أو لمرة واحدة للشقق والفلل والمنازل العائلية.',
    },
    detail: {
      en: 'Good for kitchens, bathrooms, floors, dusting, and reset visits.',
      ar: 'مناسب للمطابخ والحمامات والأرضيات وإزالة الغبار والزيارات السريعة.',
    },
    startingFrom: 120,
  },
  {
    id: 'deep',
    icon: Sparkles,
    title: { en: 'Deep cleaning', ar: 'التنظيف العميق' },
    description: {
      en: 'Detailed cleaning for spaces that need extra care and stronger attention.',
      ar: 'تنظيف تفصيلي للمساحات التي تحتاج عناية إضافية وتركيزًا أكبر.',
    },
    detail: {
      en: 'Ideal before guests, after long gaps, or when condition needs recovery.',
      ar: 'مثالي قبل الضيوف أو بعد فترات طويلة أو عند الحاجة لاستعادة نظافة المكان.',
    },
    startingFrom: 240,
  },
  {
    id: 'sofa',
    icon: Sofa,
    title: { en: 'Sofa cleaning', ar: 'تنظيف الكنب' },
    description: {
      en: 'Fabric and seating care for stains, dust, and everyday buildup.',
      ar: 'عناية بالكنب والأقمشة لإزالة البقع والغبار وآثار الاستخدام اليومي.',
    },
    detail: {
      en: 'Customers can send sofa photos on WhatsApp for a faster quote.',
      ar: 'يمكن إرسال صور الكنب عبر واتساب للحصول على عرض سعر أسرع.',
    },
    startingFrom: 90,
  },
  {
    id: 'curtain',
    icon: Layers3,
    title: { en: 'Curtain cleaning', ar: 'تنظيف الستائر' },
    description: {
      en: 'Targeted cleaning for curtain sets, panels, and delicate room finishes.',
      ar: 'تنظيف مخصص لأطقم الستائر والقطع الجانبية والتفاصيل الحساسة بالغرف.',
    },
    detail: {
      en: 'Useful for homes, offices, event spaces, and seasonal refreshes.',
      ar: 'مفيد للمنازل والمكاتب وقاعات المناسبات والتجديد الموسمي.',
    },
    startingFrom: 70,
  },
  {
    id: 'carpet',
    icon: Droplets,
    title: { en: 'Carpet cleaning', ar: 'تنظيف السجاد' },
    description: {
      en: 'Carpet and rug care for traffic marks, dust, and event recovery.',
      ar: 'عناية بالسجاد والموكيت لإزالة آثار الاستخدام والغبار وما بعد المناسبات.',
    },
    detail: {
      en: 'Best for living rooms, majlis areas, offices, and venue reset work.',
      ar: 'مناسب لغرف الجلوس والمجالس والمكاتب وأعمال إعادة ترتيب القاعات.',
    },
    startingFrom: 65,
  },
  {
    id: 'office',
    icon: Building2,
    title: { en: 'Office cleaning', ar: 'تنظيف المكاتب' },
    description: {
      en: 'Reliable cleaning for workspaces, meeting rooms, receptions, and shared areas.',
      ar: 'تنظيف موثوق لمساحات العمل وغرف الاجتماعات والاستقبال والمناطق المشتركة.',
    },
    detail: {
      en: 'Built for businesses that need clean presentation and flexible timing.',
      ar: 'مخصص للأعمال التي تحتاج مظهرًا نظيفًا ومواعيد مرنة.',
    },
    startingFrom: 180,
  },
  {
    id: 'preEvent',
    icon: PartyPopper,
    title: { en: 'Pre-event cleaning', ar: 'تنظيف قبل المناسبة' },
    description: {
      en: 'Prepare homes, offices, or venues before guests, staff, or attendees arrive.',
      ar: 'تجهيز المنازل أو المكاتب أو القاعات قبل وصول الضيوف أو الموظفين أو الحضور.',
    },
    detail: {
      en: 'Focused on presentation, detail work, and timing around the event.',
      ar: 'يركز على المظهر النهائي والتفاصيل الدقيقة والتوقيت المناسب قبل الحدث.',
    },
    startingFrom: 190,
  },
  {
    id: 'postEvent',
    icon: CheckCircle2,
    title: { en: 'Post-event cleaning', ar: 'تنظيف بعد المناسبة' },
    description: {
      en: 'Reset spaces after gatherings, functions, meetings, and private events.',
      ar: 'إعادة ترتيب وتنظيف المكان بعد التجمعات والحفلات والاجتماعات والمناسبات الخاصة.',
    },
    detail: {
      en: 'Useful for quick turnaround after guest traffic and heavy use.',
      ar: 'مفيد للتجهيز السريع بعد حركة ضيوف واستخدام مكثف للمكان.',
    },
    startingFrom: 220,
  },
  {
    id: 'move',
    icon: Truck,
    title: { en: 'Move-in / move-out cleaning', ar: 'تنظيف قبل أو بعد الانتقال' },
    description: {
      en: 'Detailed property reset for handover, new tenants, or fresh occupancy.',
      ar: 'تجهيز تفصيلي للعقار عند التسليم أو قبل السكن الجديد أو بعده.',
    },
    detail: {
      en: 'Common for empty units, apartments, offices, and villa transitions.',
      ar: 'شائع للوحدات الفارغة والشقق والمكاتب والفلل عند الانتقال.',
    },
    startingFrom: 210,
  },
  {
    id: 'regular',
    icon: Repeat,
    title: { en: 'Regular scheduled cleaning', ar: 'تنظيف دوري مجدول' },
    description: {
      en: 'Weekly or recurring cleaning for customers who want reliable routine support.',
      ar: 'تنظيف أسبوعي أو متكرر للعملاء الذين يريدون خدمة منتظمة وموثوقة.',
    },
    detail: {
      en: 'Good for homes, offices, and clients who prefer predictable upkeep.',
      ar: 'مناسب للمنازل والمكاتب والعملاء الذين يفضلون المحافظة الدورية على النظافة.',
    },
    startingFrom: 140,
  },
  {
    id: 'custom',
    icon: ClipboardList,
    title: { en: 'Custom cleaning packages', ar: 'باقات تنظيف مخصصة' },
    description: {
      en: 'Combine rooms, furniture, carpets, curtains, or event support in one request.',
      ar: 'اجمع الغرف والأثاث والسجاد والستائر أو دعم المناسبات في طلب واحد.',
    },
    detail: {
      en: 'Best when the customer needs a tailored plan or mixed services.',
      ar: 'الأفضل عندما يحتاج العميل خطة مفصلة أو خدمات متعددة في نفس الطلب.',
    },
    startingFrom: 160,
  },
];

const processSteps: ProcessStep[] = [
  {
    icon: ClipboardList,
    title: { en: 'Choose the service', ar: 'اختر الخدمة' },
    description: {
      en: 'Select the cleaning type, place category, quantities, and preferred date.',
      ar: 'حدد نوع الخدمة وفئة المكان والكميات والموعد المفضل.',
    },
  },
  {
    icon: Camera,
    title: { en: 'Get a rough estimate', ar: 'احصل على تقدير أولي' },
    description: {
      en: 'Review the price range, then send photos or extra notes on WhatsApp for faster review.',
      ar: 'راجع نطاق السعر ثم أرسل الصور أو التفاصيل الإضافية عبر واتساب لتسريع المراجعة.',
    },
  },
  {
    icon: CalendarDays,
    title: { en: 'Confirm the booking', ar: 'أكد الحجز' },
    description: {
      en: 'The final quotation is confirmed after reviewing the place, condition, and requested work.',
      ar: 'يتم تأكيد السعر النهائي بعد مراجعة المكان وحالته ونوع العمل المطلوب.',
    },
  },
];

const trustPoints: TrustPoint[] = [
  {
    icon: ShieldCheck,
    title: { en: 'Professional team', ar: 'فريق محترف' },
    description: {
      en: 'Customers see a clean, business-ready experience instead of an informal listing page.',
      ar: 'يحصل العميل على تجربة منظمة وجاهزة للأعمال بدل صفحة بسيطة غير واضحة.',
    },
  },
  {
    icon: Droplets,
    title: { en: 'Tools and supplies included', ar: 'الأدوات والمواد متوفرة' },
    description: {
      en: 'The service copy makes it clear that the cleaning team arrives prepared.',
      ar: 'النص يوضح أن فريق التنظيف يصل مجهزًا بالأدوات ومواد التنظيف اللازمة.',
    },
  },
  {
    icon: Clock3,
    title: { en: 'Fast booking flow', ar: 'حجز سريع' },
    description: {
      en: 'Estimate, booking, and confirmation stay short enough for mobile users.',
      ar: 'التقدير والحجز والتأكيد تبقى خطوات قصيرة ومناسبة لمستخدمي الجوال.',
    },
  },
  {
    icon: MessageCircleMore,
    title: { en: 'WhatsApp-first support', ar: 'دعم واتساب أولًا' },
    description: {
      en: 'Primary calls to action lead customers directly to WhatsApp with prefilled request details.',
      ar: 'أهم أزرار التواصل تنقل العميل مباشرة إلى واتساب برسالة مجهزة مسبقًا.',
    },
  },
  {
    icon: Users,
    title: { en: 'Flexible appointments', ar: 'مواعيد مرنة' },
    description: {
      en: 'Suitable for homes, offices, regular visits, and event-driven scheduling.',
      ar: 'مناسب للمنازل والمكاتب والزيارات الدورية والمواعيد المرتبطة بالمناسبات.',
    },
  },
  {
    icon: BadgeCheck,
    title: { en: 'Clear pricing notes', ar: 'ملاحظات سعر واضحة' },
    description: {
      en: 'Starting prices stay visible while the app explains how final quotations are confirmed.',
      ar: 'تظل الأسعار الابتدائية واضحة مع شرح طريقة تأكيد السعر النهائي.',
    },
  },
];

const galleryItems: GalleryItem[] = [
  {
    title: { en: 'Sofa refresh', ar: 'تجديد الكنب' },
    description: {
      en: 'Use this slot for before-and-after sofa cleaning photos and stain recovery results.',
      ar: 'استخدم هذا المكان لصور قبل وبعد تنظيف الكنب ونتائج معالجة البقع.',
    },
    before: { en: 'Before: dusty fabric and visible marks', ar: 'قبل: قماش باهت وآثار واضحة' },
    after: { en: 'After: brighter finish and cleaner seating', ar: 'بعد: مظهر أنظف ولمسة أكثر انتعاشًا' },
    themeClass: 'theme-sofa',
  },
  {
    title: { en: 'Carpet care', ar: 'العناية بالسجاد' },
    description: {
      en: 'Ready for rug, carpet, and majlis cleaning examples once photo assets are available.',
      ar: 'جاهز لعرض أمثلة تنظيف السجاد والموكيت والمجالس عند توفر الصور.',
    },
    before: { en: 'Before: traffic lines and dull texture', ar: 'قبل: آثار استخدام وملمس باهت' },
    after: { en: 'After: cleaner surface and revived color', ar: 'بعد: سطح أنظف ولون أكثر وضوحًا' },
    themeClass: 'theme-carpet',
  },
  {
    title: { en: 'Curtain detailing', ar: 'تفاصيل الستائر' },
    description: {
      en: 'Perfect for showing delicate curtain work and room-finish improvements.',
      ar: 'مثالي لإظهار تنظيف الستائر والتفاصيل النهائية للغرف.',
    },
    before: { en: 'Before: trapped dust and heavy folds', ar: 'قبل: غبار متراكم وثنيات ثقيلة' },
    after: { en: 'After: lighter finish and neater presentation', ar: 'بعد: مظهر أخف وترتيب أفضل' },
    themeClass: 'theme-curtain',
  },
  {
    title: { en: 'Kitchen reset', ar: 'إعادة ترتيب المطبخ' },
    description: {
      en: 'Use for deep-cleaning showcases around counters, cabinets, and cooking zones.',
      ar: 'استخدمه لعرض نتائج التنظيف العميق لأسطح المطبخ والخزائن ومناطق الطهي.',
    },
    before: { en: 'Before: grease spots and cluttered surfaces', ar: 'قبل: آثار دهون وأسـطح غير مرتبة' },
    after: { en: 'After: polished surfaces and organized finish', ar: 'بعد: أسطح أنظف ولمسة مرتبة' },
    themeClass: 'theme-kitchen',
  },
  {
    title: { en: 'Home detailing', ar: 'تفاصيل المنزل' },
    description: {
      en: 'Suitable for living room, bedroom, and whole-home cleaning outcomes.',
      ar: 'مناسب لعرض نتائج تنظيف غرف الجلوس والنوم والمنازل بالكامل.',
    },
    before: { en: 'Before: dust buildup and uneven presentation', ar: 'قبل: تراكم غبار ومظهر غير متوازن' },
    after: { en: 'After: tidy rooms and fresher atmosphere', ar: 'بعد: غرف مرتبة وأجواء أنظف' },
    themeClass: 'theme-home',
  },
  {
    title: { en: 'Office finishing', ar: 'تشطيب المكتب' },
    description: {
      en: 'Keep a slot for workspace, reception, and event-venue cleaning transformations.',
      ar: 'احتفظ بمكان لعرض تحول نظافة المكاتب والاستقبال وقاعات المناسبات.',
    },
    before: { en: 'Before: busy workspace and visible wear', ar: 'قبل: مساحة عمل مزدحمة وآثار استخدام' },
    after: { en: 'After: sharper presentation for staff and visitors', ar: 'بعد: مظهر أفضل للموظفين والزوار' },
    themeClass: 'theme-office',
  },
];

const testimonials: Testimonial[] = [
  {
    quote: {
      en: 'Fast response on WhatsApp, clear pricing expectations, and the team arrived ready to work.',
      ar: 'رد سريع على واتساب، وتوقعات سعر واضحة، والفريق حضر جاهزًا للعمل.',
    },
    author: { en: 'Sample home client', ar: 'نموذج عميل منزل' },
    role: { en: 'Replace with approved review', ar: 'استبدلها بمراجعة معتمدة' },
  },
  {
    quote: {
      en: 'The estimate flow made it easy to understand the service before sending final details.',
      ar: 'نموذج التقدير سهّل فهم الخدمة قبل إرسال التفاصيل النهائية.',
    },
    author: { en: 'Sample office client', ar: 'نموذج عميل مكتب' },
    role: { en: 'Replace with approved review', ar: 'استبدلها بمراجعة معتمدة' },
  },
  {
    quote: {
      en: 'Useful for event cleaning because the booking and WhatsApp confirmation stayed simple.',
      ar: 'مفيد لتنظيف المناسبات لأن الحجز وتأكيد واتساب بقيا سهلين وواضحين.',
    },
    author: { en: 'Sample event client', ar: 'نموذج عميل مناسبة' },
    role: { en: 'Replace with approved review', ar: 'استبدلها بمراجعة معتمدة' },
  },
];
const pageCopy = {
  en: {
    brandSubtitle: 'Integrated home services in Tripoli',
    topbarWhatsapp: 'WhatsApp now',
    heroBadge: 'Integrated home services in Tripoli',
    heroTitle: 'Modern cleaning services built for quick booking and clear pricing.',
    heroDescription:
      'We provide professional cleaning services for homes, offices, and events. Our trained cleaning team arrives fully prepared with the right tools and supplies, making booking simple, reliable, and practical.',
    heroPrimaryCta: 'Get a quick estimate',
    heroSecondaryCta: 'Book on WhatsApp',
    heroPills: ['Prepared team and supplies', 'Arabic and English support', 'Final quote after review'],
    heroPanelBadge: 'Starting prices',
    heroPanelTitle: 'Direct pricing guidance without pretending the final quote is fixed.',
    heroPanelDescription:
      'Customers see starting rates immediately, then send details or photos on WhatsApp for faster confirmation.',
    heroPhotoNote: 'Send sofa, carpet, curtain, kitchen, or room photos for a faster quotation.',
    serviceSectionBadge: 'Services and prices',
    serviceSectionTitle: 'Everything important stays visible from the first screen.',
    serviceSectionDescription:
      'Each card explains the service, who it fits, and where the starting rate begins so customers can decide quickly.',
    priceNote:
      'Prices start from selected ranges. Final quotations are confirmed after reviewing the service details, property size, condition, service type, and location.',
    processBadge: 'How it works',
    processTitle: 'A short flow from request to confirmed booking.',
    processDescription:
      'The web app stays practical on mobile: choose, estimate, then confirm through WhatsApp or phone.',
    trustBadge: 'Why choose us',
    trustTitle: 'Professional, premium, and easy to trust.',
    trustDescription:
      'The design keeps customer concerns obvious: clear service scope, visible starting prices, and strong WhatsApp actions.',
    galleryBadge: 'Before and after',
    galleryTitle: 'A gallery structure ready for real cleaning results.',
    galleryDescription:
      'These showcase cards are placeholders for approved photos of sofas, carpets, curtains, kitchens, homes, offices, and venues.',
    feedbackBadge: 'Trust and testimonials',
    feedbackTitle: 'Sample review cards ready to be replaced with real customer feedback.',
    feedbackDescription:
      'Use approved testimonials later. For now, the section is designed and ready for quick updates.',
    aboutBadge: 'About',
    aboutTitle: 'A trusted Tripoli-based identity for integrated home services.',
    aboutDescription:
      'The About & Contact page now shows the company identity, logo, service details, Facebook presence, and company video in one place.',
    aboutMissionTitle: 'Mission and values',
    aboutMissionText:
      'Deliver reliable cleaning services with a prepared team, straightforward communication, and booking that works well on mobile.',
    aboutFounderTitle: 'Co-founder',
    aboutFounderText:
      'Ahmed Nouh is presented as a co-founder contact within a brand centered on trust, speed, and service quality.',
    aboutOperationsTitle: 'Scope of work',
    aboutOperationsText:
      'General cleaning, deep cleaning, sofas, curtains, carpets, offices, events, move-in or move-out cleaning, scheduled visits, and custom packages.',
    estimateBadge: 'Estimate and booking',
    estimateTitle: 'Give a rough range before the final review.',
    estimateDescription:
      'The estimate updates live so customers understand the likely range before they send a final request.',
    estimateSummaryBadge: 'Live estimate',
    estimateSummaryTitle: 'Estimated price range',
    estimateSummaryNote:
      'Final quotation is confirmed after reviewing the size of the place, the condition, the requested cleaning type, and the location.',
    estimateSummaryHint: 'Send photos on WhatsApp for faster confirmation.',
    bookingReadyTitle: 'Booking draft ready',
    bookingReadyText:
      'The form generated a request reference. Use WhatsApp or call now to confirm the final quotation.',
    formName: 'Full name',
    formPhone: 'Phone / WhatsApp',
    formService: 'Service type',
    formProperty: 'Home / office / event',
    formRooms: 'Number of rooms',
    formSofas: 'Number of sofas',
    formCurtains: 'Curtain quantity',
    formCarpets: 'Carpet quantity',
    formLocation: 'Location',
    formDate: 'Preferred date',
    formNotes: 'Notes',
    namePlaceholder: 'Customer name',
    phonePlaceholder: 'Phone number',
    locationPlaceholder: 'Tripoli, Benghazi, Misrata, or another area',
    notesPlaceholder: 'Access details, cleaning condition, custom requests, or timing notes',
    submitBooking: 'Request final quote',
    openWhatsappQuote: 'Open WhatsApp quote',
    callNow: 'Call now',
    requestReference: 'Request reference',
    pendingValue: 'To be confirmed',
    contactBadge: 'Contact',
    contactTitle: 'WhatsApp, phone, Facebook, and location stay clear and easy to reach.',
    contactDescription:
      'Customers can contact the company directly, view the service area, and open the official Facebook page from the same page.',
    contactFormTitle: 'Quick contact form',
    contactFormDescription: 'This sends a short prefilled message to WhatsApp.',
    contactMessageLabel: 'Message',
    contactMessagePlaceholder: 'Tell us what you need cleaned or ask for a callback',
    sendMessage: 'Send message on WhatsApp',
    emailPlaceholderNote: 'Email can be added later if needed.',
    serviceAreaPlaceholderNote: 'Serving Tripoli and nearby requests based on availability.',
    socialTitle: 'Official Facebook page',
    socialDescription: 'Open the company Facebook page for updates, media, and direct contact.',
    footerNote:
      'Al-Iktisah Integrated Home Services Company presents its Tripoli identity with direct contact and media on one page.',
    footerWhatsapp: 'Send photos for faster confirmation',
  },
  ar: {
    brandSubtitle: 'خدمات منزلية متكاملة في طرابلس',
    topbarWhatsapp: 'واتساب الآن',
    heroBadge: 'خدمات منزلية متكاملة في طرابلس',
    heroTitle: 'خدمات تنظيف عصرية بحجز سريع وتسعير واضح.',
    heroDescription:
      'نقدم خدمات تنظيف احترافية للمنازل والمكاتب والمناسبات. يصل فريق التنظيف لدينا مجهزًا بالكامل بالأدوات ومواد التنظيف المناسبة، مما يجعل الحجز سهلًا وموثوقًا وعمليًا.',
    heroPrimaryCta: 'احصل على تقدير سريع',
    heroSecondaryCta: 'احجز عبر واتساب',
    heroPills: ['فريق مجهز بالكامل', 'دعم بالعربية والإنجليزية', 'السعر النهائي بعد المراجعة'],
    heroPanelBadge: 'أسعار ابتدائية',
    heroPanelTitle: 'إرشاد سعري مباشر دون الادعاء بأن السعر النهائي ثابت.',
    heroPanelDescription:
      'يرى العميل الأسعار المبدئية فورًا، ثم يرسل التفاصيل أو الصور عبر واتساب للحصول على تأكيد أسرع.',
    heroPhotoNote: 'أرسل صور الكنب أو السجاد أو الستائر أو المطبخ أو الغرف للحصول على عرض أسرع.',
    serviceSectionBadge: 'الخدمات والأسعار',
    serviceSectionTitle: 'كل ما يهم العميل يظهر بوضوح من أول شاشة.',
    serviceSectionDescription:
      'كل بطاقة تشرح الخدمة وما يناسبها وأين يبدأ السعر حتى يتمكن العميل من اتخاذ القرار بسرعة.',
    priceNote:
      'الأسعار تبدأ من نطاقات محددة، ويتم تأكيد السعر النهائي بعد مراجعة تفاصيل الخدمة ومساحة المكان وحالته ونوع الخدمة والموقع.',
    processBadge: 'طريقة العمل',
    processTitle: 'خطوات قصيرة من الطلب إلى تأكيد الحجز.',
    processDescription:
      'التجربة عملية على الجوال: اختر الخدمة، شاهد التقدير، ثم أكد عبر واتساب أو الهاتف.',
    trustBadge: 'لماذا نحن',
    trustTitle: 'مظهر احترافي ومريح وموثوق.',
    trustDescription:
      'التصميم يوضح أهم ما يبحث عنه العميل: الخدمة المناسبة، أسعار البداية، وسرعة التواصل عبر واتساب.',
    galleryBadge: 'قبل وبعد',
    galleryTitle: 'هيكل معرض جاهز لعرض نتائج التنظيف الحقيقية.',
    galleryDescription:
      'هذه البطاقات تعتبر أماكن مخصصة لصور معتمدة قبل وبعد للكنب والسجاد والستائر والمطابخ والمنازل والمكاتب والقاعات.',
    feedbackBadge: 'الثقة والتقييمات',
    feedbackTitle: 'بطاقات مراجعات نموذجية جاهزة للاستبدال بآراء العملاء الفعلية.',
    feedbackDescription:
      'يمكن إضافة التقييمات المعتمدة لاحقًا، أما الآن فالقسم جاهز ومصمم للتحديث السريع.',
    aboutBadge: 'من نحن',
    aboutTitle: 'هوية موثوقة لخدمات منزلية متكاملة انطلاقًا من طرابلس.',
    aboutDescription:
      'تعرض صفحة من نحن والتواصل هوية الشركة والشعار وتفاصيل النشاط وصفحة فيسبوك والفيديو التعريفي في مكان واحد.',
    aboutMissionTitle: 'الرسالة والقيم',
    aboutMissionText:
      'تقديم خدمة تنظيف موثوقة عبر فريق مجهز، وتواصل واضح، وحجز يعمل بشكل ممتاز على الجوال.',
    aboutFounderTitle: 'الشريك المؤسس',
    aboutFounderText:
      'يظهر أحمد نوح كشريك مؤسس ضمن علامة تركز على الثقة والسرعة وجودة الخدمة.',
    aboutOperationsTitle: 'نطاق العمل',
    aboutOperationsText:
      'تنظيف عام، تنظيف عميق، كنب، ستائر، سجاد، مكاتب، مناسبات، تنظيف قبل أو بعد الانتقال، زيارات دورية، وباقات مخصصة.',
    estimateBadge: 'التقدير والحجز',
    estimateTitle: 'امنح العميل نطاقًا تقريبيًا قبل المراجعة النهائية.',
    estimateDescription:
      'يتحدث التقدير مباشرة مع العميل ويعرض نطاقًا متغيرًا حتى يفهم السعر المحتمل قبل إرسال الطلب النهائي.',
    estimateSummaryBadge: 'تقدير مباشر',
    estimateSummaryTitle: 'نطاق السعر المتوقع',
    estimateSummaryNote:
      'يتم تأكيد السعر النهائي بعد مراجعة مساحة المكان وحالته ونوع التنظيف المطلوب والموقع.',
    estimateSummaryHint: 'أرسل الصور عبر واتساب لتأكيد أسرع.',
    bookingReadyTitle: 'تم تجهيز طلب الحجز',
    bookingReadyText:
      'أنشأ النموذج رقمًا مرجعيًا للطلب. استخدم واتساب أو الاتصال الآن لتأكيد السعر النهائي.',
    formName: 'الاسم الكامل',
    formPhone: 'الهاتف / واتساب',
    formService: 'نوع الخدمة',
    formProperty: 'منزل / مكتب / مناسبة',
    formRooms: 'عدد الغرف',
    formSofas: 'عدد الكنب',
    formCurtains: 'عدد الستائر',
    formCarpets: 'عدد السجاد',
    formLocation: 'الموقع',
    formDate: 'التاريخ المفضل',
    formNotes: 'ملاحظات',
    namePlaceholder: 'اسم العميل',
    phonePlaceholder: 'رقم الهاتف',
    locationPlaceholder: 'طرابلس أو بنغازي أو مصراتة أو منطقة أخرى',
    notesPlaceholder: 'تفاصيل الوصول أو حالة التنظيف أو الطلبات الخاصة أو توقيت العمل',
    submitBooking: 'اطلب عرض السعر النهائي',
    openWhatsappQuote: 'افتح عرض واتساب',
    callNow: 'اتصل الآن',
    requestReference: 'رقم الطلب',
    pendingValue: 'يتم التأكيد لاحقًا',
    contactBadge: 'التواصل',
    contactTitle: 'واتساب والهاتف وفيسبوك والموقع كلها واضحة وسهلة الوصول.',
    contactDescription:
      'يمكن للعميل الوصول مباشرة إلى الشركة ومعرفة نطاق الخدمة وفتح صفحة فيسبوك الرسمية من نفس الصفحة.',
    contactFormTitle: 'نموذج تواصل سريع',
    contactFormDescription: 'يرسل هذا النموذج رسالة قصيرة جاهزة إلى واتساب.',
    contactMessageLabel: 'الرسالة',
    contactMessagePlaceholder: 'أخبرنا بما تريد تنظيفه أو اطلب مكالمة',
    sendMessage: 'أرسل الرسالة عبر واتساب',
    emailPlaceholderNote: 'يمكن إضافة البريد الإلكتروني لاحقًا إذا لزم الأمر.',
    serviceAreaPlaceholderNote: 'الخدمة داخل طرابلس والطلبات القريبة حسب التوفر.',
    socialTitle: 'صفحة فيسبوك الرسمية',
    socialDescription: 'افتح صفحة الشركة على فيسبوك لمتابعة التحديثات والوسائط والتواصل المباشر.',
    footerNote:
      'تعرض شركة الاكتساح للخدمات المنزلية المتكاملة هويتها في طرابلس مع وسائل تواصل ووسائط مباشرة في صفحة واحدة.',
    footerWhatsapp: 'أرسل الصور للحصول على تأكيد أسرع',
  },
} as const;

const initialEstimateState: EstimateFormState = {
  name: '',
  phone: '',
  serviceType: 'home',
  propertyType: 'home',
  rooms: 2,
  sofas: 1,
  curtains: 2,
  carpets: 1,
  location: '',
  preferredDate: '',
  notes: '',
};

const initialContactState: ContactFormState = {
  name: '',
  phone: '',
  message: '',
};

const serviceRanges: Record<ServiceId, EstimateResult> = {
  home: { min: 120, max: 180 },
  deep: { min: 240, max: 360 },
  sofa: { min: 90, max: 150 },
  curtain: { min: 70, max: 120 },
  carpet: { min: 65, max: 110 },
  office: { min: 180, max: 320 },
  preEvent: { min: 190, max: 310 },
  postEvent: { min: 220, max: 360 },
  move: { min: 210, max: 340 },
  regular: { min: 140, max: 230 },
  custom: { min: 160, max: 400 },
};

const propertyAdjustments: Record<PropertyType, EstimateResult> = {
  home: { min: 0, max: 25 },
  office: { min: 25, max: 60 },
  event: { min: 35, max: 85 },
};

const formatCurrency = (value: number, locale: Locale) => {
  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en', {
    maximumFractionDigits: 0,
  }).format(value);

  return locale === 'ar' ? `${formatted} د.ل` : `${formatted} LYD`;
};

const translate = (value: Translation, locale: Locale) => value[locale];

const calculateEstimate = (form: EstimateFormState): EstimateResult => {
  const base = serviceRanges[form.serviceType];
  const property = propertyAdjustments[form.propertyType];

  const roomMin = form.rooms * 18;
  const roomMax = form.rooms * 30;
  const sofaMin = form.sofas * 20;
  const sofaMax = form.sofas * 32;
  const curtainMin = form.curtains * 7;
  const curtainMax = form.curtains * 14;
  const carpetMin = form.carpets * 12;
  const carpetMax = form.carpets * 20;

  return {
    min: base.min + property.min + roomMin + sofaMin + curtainMin + carpetMin,
    max: base.max + property.max + roomMax + sofaMax + curtainMax + carpetMax,
  };
};

const getServiceById = (serviceId: ServiceId) => {
  return services.find((service) => service.id === serviceId) ?? services[0];
};
const buildEstimateMessage = (
  locale: Locale,
  form: EstimateFormState,
  estimate: EstimateResult,
  requestReference?: string,
) => {
  const service = getServiceById(form.serviceType);
  const serviceLabel = translate(service.title, locale);
  const propertyLabel = translate(propertyTypeLabels[form.propertyType], locale);
  const estimateText = `${formatCurrency(estimate.min, locale)} - ${formatCurrency(estimate.max, locale)}`;

  const lines =
    locale === 'ar'
      ? [
          'طلب تنظيف جديد',
          requestReference ? `رقم الطلب: ${requestReference}` : null,
          `الاسم: ${form.name || '-'}`,
          `الهاتف: ${form.phone || '-'}`,
          `الخدمة: ${serviceLabel}`,
          `نوع المكان: ${propertyLabel}`,
          `عدد الغرف: ${form.rooms}`,
          `عدد الكنب: ${form.sofas}`,
          `عدد الستائر: ${form.curtains}`,
          `عدد السجاد: ${form.carpets}`,
          `الموقع: ${form.location || '-'}`,
          `التاريخ المفضل: ${form.preferredDate || '-'}`,
          `النطاق التقريبي: ${estimateText}`,
          `ملاحظات: ${form.notes || '-'}`,
          'يمكنني إرسال صور عبر واتساب للحصول على عرض أسرع.',
        ]
      : [
          'New cleaning request',
          requestReference ? `Request reference: ${requestReference}` : null,
          `Name: ${form.name || '-'}`,
          `Phone: ${form.phone || '-'}`,
          `Service: ${serviceLabel}`,
          `Property type: ${propertyLabel}`,
          `Rooms: ${form.rooms}`,
          `Sofas: ${form.sofas}`,
          `Curtains: ${form.curtains}`,
          `Carpets: ${form.carpets}`,
          `Location: ${form.location || '-'}`,
          `Preferred date: ${form.preferredDate || '-'}`,
          `Estimated range: ${estimateText}`,
          `Notes: ${form.notes || '-'}`,
          'I can send photos on WhatsApp for a faster quote.',
        ];

  return lines.filter(Boolean).join('\n');
};

const buildContactMessage = (locale: Locale, form: ContactFormState) => {
  const lines =
    locale === 'ar'
      ? [
          'رسالة تواصل سريعة',
          `الاسم: ${form.name || '-'}`,
          `الهاتف: ${form.phone || '-'}`,
          `الرسالة: ${form.message || '-'}`,
        ]
      : [
          'Quick contact message',
          `Name: ${form.name || '-'}`,
          `Phone: ${form.phone || '-'}`,
          `Message: ${form.message || '-'}`,
        ];

  return lines.join('\n');
};

const createRequestReference = () => {
  return `CLN-${Date.now().toString().slice(-6)}`;
};

const openUrl = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    return 'ar';
  });
  const [estimateForm, setEstimateForm] = useState<EstimateFormState>(initialEstimateState);
  const [contactForm, setContactForm] = useState<ContactFormState>(initialContactState);
  const [requestReference, setRequestReference] = useState('');
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  const t = pageCopy[locale];
  const currentService = getServiceById(estimateForm.serviceType);
  const estimate = useMemo(() => calculateEstimate(estimateForm), [estimateForm]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    document.title = `${translate(BUSINESS_DETAILS.companyName, locale)} | ${
      locale === 'ar' ? 'خدمات تنظيف احترافية' : 'Professional Cleaning Services'
    }`;
  }, [direction, locale]);

  const whatsappEstimateLink = useMemo(() => {
    const message = buildEstimateMessage(locale, estimateForm, estimate, requestReference || undefined);
    return `https://wa.me/${BUSINESS_DETAILS.phoneDigits}?text=${encodeURIComponent(message)}`;
  }, [estimate, estimateForm, locale, requestReference]);

  const whatsappContactLink = useMemo(() => {
    const message = buildContactMessage(locale, contactForm);
    return `https://wa.me/${BUSINESS_DETAILS.phoneDigits}?text=${encodeURIComponent(message)}`;
  }, [contactForm, locale]);

  const estimateSummaryRows = [
    { label: t.formService, value: translate(currentService.title, locale) },
    { label: t.formProperty, value: translate(propertyTypeLabels[estimateForm.propertyType], locale) },
    { label: t.formRooms, value: String(estimateForm.rooms) },
    { label: t.formSofas, value: String(estimateForm.sofas) },
    { label: t.formCurtains, value: String(estimateForm.curtains) },
    { label: t.formCarpets, value: String(estimateForm.carpets) },
    { label: t.formLocation, value: estimateForm.location || t.pendingValue },
    { label: t.formDate, value: estimateForm.preferredDate || t.pendingValue },
  ];

  const featuredServices = services.slice(0, 4);

  const updateEstimateField = <K extends keyof EstimateFormState>(field: K, value: EstimateFormState[K]) => {
    setEstimateForm((current) => ({ ...current, [field]: value }));
  };

  const updateContactField = <K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) => {
    setContactForm((current) => ({ ...current, [field]: value }));
  };

  const goToSection = (sectionId: SectionId) => {
    setActiveSection(sectionId);
  };

  const handleBookingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextReference = createRequestReference();
    setRequestReference(nextReference);
    const message = buildEstimateMessage(locale, estimateForm, estimate, nextReference);
    const url = `https://wa.me/${BUSINESS_DETAILS.phoneDigits}?text=${encodeURIComponent(message)}`;
    openUrl(url);
  };

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openUrl(whatsappContactLink);
  };

  const handleCountField = (
    field: 'rooms' | 'sofas' | 'curtains' | 'carpets',
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = Number(event.target.value);
    updateEstimateField(field, Number.isNaN(nextValue) ? 0 : Math.max(0, nextValue));
  };

  return (
    <div className="cleaning-app" dir={direction}>
      <div className="page-shell">
        <header className="topbar card">
          <button type="button" className="brand-lockup brand-button" onClick={() => goToSection('home')}>
            <span className="brand-mark">
              <img src={BRAND_LOGO_PATH} alt={translate(BUSINESS_DETAILS.brandName, locale)} />
            </span>
            <div>
              <p className="brand-title">{translate(BUSINESS_DETAILS.companyName, locale)}</p>
              <p className="brand-subtitle">{t.brandSubtitle}</p>
            </div>
          </button>

          <nav className="topnav" aria-label={locale === 'ar' ? 'الأقسام الرئيسية' : 'Main sections'}>
            {navigationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nav-button${item.id === activeSection ? ' active' : ''}`}
                aria-current={item.id === activeSection ? 'page' : undefined}
                onClick={() => goToSection(item.id)}
              >
                {translate(item.label, locale)}
              </button>
            ))}
          </nav>

          <div className="topbar-actions">
            <div className="language-switch" aria-label={locale === 'ar' ? 'تبديل اللغة' : 'Switch language'}>
              <button type="button" className={locale === 'ar' ? 'active' : ''} onClick={() => setLocale('ar')}>
                AR
              </button>
              <button type="button" className={locale === 'en' ? 'active' : ''} onClick={() => setLocale('en')}>
                EN
              </button>
            </div>
            <a className="inline-whatsapp" href={whatsappEstimateLink} target="_blank" rel="noreferrer">
              <MessageCircleMore size={18} />
              {t.topbarWhatsapp}
            </a>
          </div>
        </header>

        <main className="content-stack section-viewer">
          <section id="home" className="hero-section page-panel" style={{ display: activeSection === 'home' ? undefined : 'none' }}>
            <div className="hero-copy">
              <span className="section-badge">
                <Globe size={16} />
                {t.heroBadge}
              </span>
              <h1>{t.heroTitle}</h1>
              <p className="hero-description">{t.heroDescription}</p>
              <div className="hero-actions">
                <button type="button" className="primary-button" onClick={() => goToSection('estimate')}>
                  {t.heroPrimaryCta}
                  <ArrowRight size={18} />
                </button>
                <a className="secondary-button" href={whatsappEstimateLink} target="_blank" rel="noreferrer">
                  <MessageCircleMore size={18} />
                  {t.heroSecondaryCta}
                </a>
              </div>
              <div className="hero-pills">
                {t.heroPills.map((pill) => (
                  <span key={pill} className="pill">
                    <BadgeCheck size={15} />
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="hero-panel card">
              <div className="hero-panel-header">
                <span className="mini-badge">{t.heroPanelBadge}</span>
                <h2>{t.heroPanelTitle}</h2>
                <p>{t.heroPanelDescription}</p>
              </div>

              <div className="price-preview-list">
                {featuredServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div key={service.id} className="price-preview-item">
                      <span className="price-preview-icon">
                        <Icon size={18} />
                      </span>
                      <div>
                        <strong>{translate(service.title, locale)}</strong>
                        <span>
                          {locale === 'ar'
                            ? `تبدأ من ${formatCurrency(service.startingFrom, locale)}`
                            : `Starting from ${formatCurrency(service.startingFrom, locale)}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hero-photo-card">
                <Camera size={18} />
                <p>{t.heroPhotoNote}</p>
              </div>
            </div>
          </section>

          <section
            id="services"
            className="content-section page-panel"
            style={{ display: activeSection === 'services' ? undefined : 'none' }}
          >
            <SectionHeading
              badge={t.serviceSectionBadge}
              title={t.serviceSectionTitle}
              description={t.serviceSectionDescription}
            />

            <div className="service-grid">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <article key={service.id} className="service-card card">
                    <div className="service-icon">
                      <Icon size={22} />
                    </div>
                    <div className="service-copy">
                      <h3>{translate(service.title, locale)}</h3>
                      <p>{translate(service.description, locale)}</p>
                      <p className="service-detail">{translate(service.detail, locale)}</p>
                    </div>
                    <div className="service-footer">
                      <strong>
                        {locale === 'ar'
                          ? `تبدأ من ${formatCurrency(service.startingFrom, locale)}`
                          : `Starting from ${formatCurrency(service.startingFrom, locale)}`}
                      </strong>
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => {
                          updateEstimateField('serviceType', service.id);
                          goToSection('estimate');
                        }}
                      >
                        {locale === 'ar' ? 'اطلب عرض سعر' : 'Request quote'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="price-note card muted-card">
              <Sparkles size={18} />
              <p>{t.priceNote}</p>
            </div>
          </section>

          <div className="page-panel composite-page" style={{ display: activeSection === 'process' ? 'flex' : 'none' }}>
            <section id="process" className="content-section">
            <SectionHeading badge={t.processBadge} title={t.processTitle} description={t.processDescription} />
            <div className="process-grid">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={translate(step.title, locale)} className="process-card card">
                    <div className="process-index">0{index + 1}</div>
                    <div className="process-icon">
                      <Icon size={22} />
                    </div>
                    <h3>{translate(step.title, locale)}</h3>
                    <p>{translate(step.description, locale)}</p>
                  </article>
                );
              })}
            </div>
            </section>
            <section className="content-section">
              <SectionHeading badge={t.trustBadge} title={t.trustTitle} description={t.trustDescription} />
              <div className="trust-grid">
                {trustPoints.map((point) => {
                  const Icon = point.icon;
                  return (
                    <article key={translate(point.title, locale)} className="trust-card card">
                      <div className="trust-icon">
                        <Icon size={20} />
                      </div>
                      <h3>{translate(point.title, locale)}</h3>
                      <p>{translate(point.description, locale)}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="content-section">
              <SectionHeading badge={t.galleryBadge} title={t.galleryTitle} description={t.galleryDescription} />
              <div className="gallery-grid">
                {galleryItems.map((item) => (
                  <article key={translate(item.title, locale)} className="gallery-card card">
                    <div className={`gallery-visual ${item.themeClass}`}>
                      <span>{locale === 'ar' ? 'قبل' : 'Before'}</span>
                      <ArrowRight size={18} />
                      <span>{locale === 'ar' ? 'بعد' : 'After'}</span>
                    </div>
                    <div className="gallery-copy">
                      <h3>{translate(item.title, locale)}</h3>
                      <p>{translate(item.description, locale)}</p>
                      <div className="gallery-notes">
                        <span>{translate(item.before, locale)}</span>
                        <span>{translate(item.after, locale)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="content-section">
              <SectionHeading badge={t.feedbackBadge} title={t.feedbackTitle} description={t.feedbackDescription} />
              <div className="testimonial-grid">
                {testimonials.map((testimonial) => (
                  <article key={translate(testimonial.author, locale)} className="testimonial-card card">
                    <div className="testimonial-stars" aria-hidden="true">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="testimonial-quote">“{translate(testimonial.quote, locale)}”</p>
                    <div className="testimonial-author">
                      <strong>{translate(testimonial.author, locale)}</strong>
                      <span>{translate(testimonial.role, locale)}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section id="about" className="content-section page-panel" style={{ display: activeSection === 'about' ? undefined : 'none' }}>
            <div className="about-contact-stack">
              <div className="content-section">
                <SectionHeading badge={t.aboutBadge} title={t.aboutTitle} description={t.aboutDescription} />
                <div className="about-layout">
                  <article className="about-story card">
                    <div className="about-block">
                      <h3>{t.aboutMissionTitle}</h3>
                      <p>{t.aboutMissionText}</p>
                    </div>
                    <div className="about-block">
                      <h3>{t.aboutFounderTitle}</h3>
                      <p>{t.aboutFounderText}</p>
                    </div>
                    <div className="about-block">
                      <h3>{t.aboutOperationsTitle}</h3>
                      <p>{t.aboutOperationsText}</p>
                    </div>
                  </article>

                  <article className="about-details card">
                    <div className="detail-row">
                      <span>{locale === 'ar' ? 'اسم الشركة' : 'Company name'}</span>
                      <strong>{translate(BUSINESS_DETAILS.companyName, locale)}</strong>
                    </div>
                    <div className="detail-row">
                      <span>{locale === 'ar' ? 'الاسم التجاري' : 'Brand name'}</span>
                      <strong>{translate(BUSINESS_DETAILS.brandName, locale)}</strong>
                    </div>
                    <div className="detail-row">
                      <span>{locale === 'ar' ? 'الهاتف / واتساب' : 'Phone / WhatsApp'}</span>
                      <a href={`tel:${BUSINESS_DETAILS.phoneDigits}`}>{BUSINESS_DETAILS.phoneDisplay}</a>
                    </div>
                    {BUSINESS_DETAILS.email ? (
                      <div className="detail-row">
                        <span>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span>
                        <a href={`mailto:${BUSINESS_DETAILS.email}`}>{BUSINESS_DETAILS.email}</a>
                      </div>
                    ) : null}
                    <div className="detail-row">
                      <span>{locale === 'ar' ? 'فيسبوك' : 'Facebook'}</span>
                      <a href={BUSINESS_DETAILS.facebookUrl} target="_blank" rel="noreferrer">
                        {locale === 'ar' ? 'افتح الصفحة الرسمية' : 'Open official page'}
                      </a>
                    </div>
                    <div className="detail-row muted-detail">
                      <span>{locale === 'ar' ? 'ملاحظة التواصل' : 'Contact note'}</span>
                      <strong>{t.emailPlaceholderNote}</strong>
                    </div>
                    <div className="detail-row muted-detail">
                      <span>{locale === 'ar' ? 'مناطق الخدمة' : 'Service area'}</span>
                      <strong>{translate(BUSINESS_DETAILS.serviceArea, locale)}</strong>
                    </div>
                    <div className="detail-row">
                      <span>{locale === 'ar' ? 'الشريك المؤسس' : 'Co-founder'}</span>
                      <strong>{translate(BUSINESS_DETAILS.coFounder, locale)}</strong>
                    </div>
                  </article>
                </div>

                <div className="about-media-grid">
                  <article className="brand-showcase card">
                    <img className="brand-showcase-image" src={BRAND_LOGO_PATH} alt={translate(BUSINESS_DETAILS.brandName, locale)} />
                    <div className="brand-showcase-copy">
                      <span className="mini-badge">{locale === 'ar' ? 'هوية الشركة' : 'Brand identity'}</span>
                      <h3>{translate(BUSINESS_DETAILS.brandName, locale)}</h3>
                      <p>{translate(BUSINESS_DETAILS.companyName, locale)}</p>
                      <p>{translate(BUSINESS_DETAILS.serviceArea, locale)}</p>
                      <a className="secondary-button" href={BUSINESS_DETAILS.facebookUrl} target="_blank" rel="noreferrer">
                        <Globe size={18} />
                        {locale === 'ar' ? 'افتح صفحة فيسبوك' : 'Open Facebook page'}
                      </a>
                    </div>
                  </article>

                  <article className="brand-video-card card">
                    <div className="brand-video-copy">
                      <span className="mini-badge">{locale === 'ar' ? 'فيديو الشركة' : 'Company video'}</span>
                      <h3>{locale === 'ar' ? 'تعرف على الشركة من خلال الفيديو' : 'See the company through video'}</h3>
                      <p>
                        {locale === 'ar'
                          ? 'أضفنا الفيديو المرسل داخل صفحة من نحن والتواصل ليظهر النشاط بشكل أوضح ومباشر.'
                          : 'The provided video is embedded directly into About & Contact so visitors can see the business visually.'}
                      </p>
                    </div>
                    <video className="about-video-player" controls preload="metadata" playsInline>
                      <source src={ABOUT_VIDEO_PATH} type="video/mp4" />
                    </video>
                  </article>
                </div>
              </div>

              <div className="content-section">
                <SectionHeading badge={t.contactBadge} title={t.contactTitle} description={t.contactDescription} />
                <div className="contact-layout">
                  <div className="contact-grid">
                    <article className="contact-card card">
                      <span>{locale === 'ar' ? 'الهاتف / واتساب' : 'Phone / WhatsApp'}</span>
                      <a href={`tel:${BUSINESS_DETAILS.phoneDigits}`}>{BUSINESS_DETAILS.phoneDisplay}</a>
                    </article>
                    {BUSINESS_DETAILS.email ? (
                      <article className="contact-card card">
                        <span>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span>
                        <a href={`mailto:${BUSINESS_DETAILS.email}`}>{BUSINESS_DETAILS.email}</a>
                        <small>{t.emailPlaceholderNote}</small>
                      </article>
                    ) : null}
                    <article className="contact-card card">
                      <span>{locale === 'ar' ? 'مناطق الخدمة' : 'Service area'}</span>
                      <strong>{translate(BUSINESS_DETAILS.serviceArea, locale)}</strong>
                      <small>{t.serviceAreaPlaceholderNote}</small>
                    </article>
                    <article className="contact-card card">
                      <span>{locale === 'ar' ? 'فيسبوك' : 'Facebook'}</span>
                      <a href={BUSINESS_DETAILS.facebookUrl} target="_blank" rel="noreferrer">
                        {locale === 'ar' ? 'افتح الصفحة الرسمية' : 'Open official page'}
                      </a>
                      <small>{t.socialDescription}</small>
                    </article>
                    <article className="contact-card card">
                      <span>{locale === 'ar' ? 'الشريك المؤسس' : 'Co-founder'}</span>
                      <strong>{translate(BUSINESS_DETAILS.coFounder, locale)}</strong>
                      <small>
                        {locale === 'ar'
                          ? 'يمكن إبراز الاسم في صفحة من نحن أو التواصل.'
                          : 'Can be highlighted in About or Contact.'}
                      </small>
                    </article>
                  </div>

                  <form className="contact-form card" onSubmit={handleContactSubmit}>
                    <h3>{t.contactFormTitle}</h3>
                    <p>{t.contactFormDescription}</p>
                    <label>
                      <span>{t.formName}</span>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(event) => updateContactField('name', event.target.value)}
                        placeholder={t.namePlaceholder}
                      />
                    </label>
                    <label>
                      <span>{t.formPhone}</span>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(event) => updateContactField('phone', event.target.value)}
                        placeholder={t.phonePlaceholder}
                      />
                    </label>
                    <label>
                      <span>{t.contactMessageLabel}</span>
                      <textarea
                        rows={5}
                        value={contactForm.message}
                        onChange={(event) => updateContactField('message', event.target.value)}
                        placeholder={t.contactMessagePlaceholder}
                        required
                      />
                    </label>
                    <button type="submit" className="primary-button">
                      <MessageCircleMore size={18} />
                      {t.sendMessage}
                    </button>

                    <div className="social-placeholder muted-card">
                      <h4>{t.socialTitle}</h4>
                      <p>{t.socialDescription}</p>
                      <div className="social-tags">
                        <a href={BUSINESS_DETAILS.facebookUrl} target="_blank" rel="noreferrer">
                          Facebook
                        </a>
                        <span>{translate(BUSINESS_DETAILS.serviceArea, locale)}</span>
                        <span>{translate(BUSINESS_DETAILS.brandName, locale)}</span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>

          <section
            id="estimate"
            className="content-section page-panel"
            style={{ display: activeSection === 'estimate' ? undefined : 'none' }}
          >
            <SectionHeading badge={t.estimateBadge} title={t.estimateTitle} description={t.estimateDescription} />
            <div className="estimate-layout">
              <form className="estimate-form card" onSubmit={handleBookingSubmit}>
                <div className="form-grid two-columns">
                  <label>
                    <span>{t.formName}</span>
                    <input
                      type="text"
                      value={estimateForm.name}
                      onChange={(event) => updateEstimateField('name', event.target.value)}
                      placeholder={t.namePlaceholder}
                      required
                    />
                  </label>
                  <label>
                    <span>{t.formPhone}</span>
                    <input
                      type="tel"
                      value={estimateForm.phone}
                      onChange={(event) => updateEstimateField('phone', event.target.value)}
                      placeholder={t.phonePlaceholder}
                      required
                    />
                  </label>
                  <label>
                    <span>{t.formService}</span>
                    <select
                      value={estimateForm.serviceType}
                      onChange={(event) => updateEstimateField('serviceType', event.target.value as ServiceId)}
                    >
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {translate(service.title, locale)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>{t.formProperty}</span>
                    <select
                      value={estimateForm.propertyType}
                      onChange={(event) => updateEstimateField('propertyType', event.target.value as PropertyType)}
                    >
                      {Object.entries(propertyTypeLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {translate(label, locale)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>{t.formRooms}</span>
                    <input type="number" min="0" value={estimateForm.rooms} onChange={(event) => handleCountField('rooms', event)} />
                  </label>
                  <label>
                    <span>{t.formSofas}</span>
                    <input type="number" min="0" value={estimateForm.sofas} onChange={(event) => handleCountField('sofas', event)} />
                  </label>
                  <label>
                    <span>{t.formCurtains}</span>
                    <input type="number" min="0" value={estimateForm.curtains} onChange={(event) => handleCountField('curtains', event)} />
                  </label>
                  <label>
                    <span>{t.formCarpets}</span>
                    <input type="number" min="0" value={estimateForm.carpets} onChange={(event) => handleCountField('carpets', event)} />
                  </label>
                  <label className="span-two">
                    <span>{t.formLocation}</span>
                    <input
                      type="text"
                      value={estimateForm.location}
                      onChange={(event) => updateEstimateField('location', event.target.value)}
                      placeholder={t.locationPlaceholder}
                      required
                    />
                  </label>
                  <label>
                    <span>{t.formDate}</span>
                    <input
                      type="date"
                      value={estimateForm.preferredDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(event) => updateEstimateField('preferredDate', event.target.value)}
                      required
                    />
                  </label>
                  <label className="span-two">
                    <span>{t.formNotes}</span>
                    <textarea
                      rows={5}
                      value={estimateForm.notes}
                      onChange={(event) => updateEstimateField('notes', event.target.value)}
                      placeholder={t.notesPlaceholder}
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="primary-button">
                    {t.submitBooking}
                    <ArrowRight size={18} />
                  </button>
                  <a className="secondary-button" href={whatsappEstimateLink} target="_blank" rel="noreferrer">
                    <MessageCircleMore size={18} />
                    {t.openWhatsappQuote}
                  </a>
                </div>
              </form>

              <aside className="estimate-summary card">
                <div className="estimate-summary-header">
                  <span className="mini-badge">{t.estimateSummaryBadge}</span>
                  <h3>{t.estimateSummaryTitle}</h3>
                </div>
                <div className="estimate-range">
                  <strong>{formatCurrency(estimate.min, locale)}</strong>
                  <span>-</span>
                  <strong>{formatCurrency(estimate.max, locale)}</strong>
                </div>
                <p className="summary-note">{t.estimateSummaryNote}</p>

                <div className="summary-list">
                  {estimateSummaryRows.map((row) => (
                    <div key={row.label} className="summary-row">
                      <span>{row.label}</span>
                      <strong>{row.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="summary-tip muted-card">
                  <Camera size={18} />
                  <p>{t.estimateSummaryHint}</p>
                </div>

                {requestReference ? (
                  <div className="booking-ready card inner-card">
                    <div className="booking-ready-header">
                      <BadgeCheck size={18} />
                      <strong>{t.bookingReadyTitle}</strong>
                    </div>
                    <p>{t.bookingReadyText}</p>
                    <div className="summary-row reference-row">
                      <span>{t.requestReference}</span>
                      <strong>{requestReference}</strong>
                    </div>
                    <div className="booking-ready-actions">
                      <a className="secondary-button" href={whatsappEstimateLink} target="_blank" rel="noreferrer">
                        <MessageCircleMore size={18} />
                        {t.openWhatsappQuote}
                      </a>
                      <a className="text-button" href={`tel:${BUSINESS_DETAILS.phoneDigits}`}>
                        <PhoneCall size={17} />
                        {t.callNow}
                      </a>
                    </div>
                  </div>
                ) : null}
              </aside>
            </div>
          </section>

        </main>

        <footer className="footer card" style={{ display: activeSection === 'about' ? undefined : 'none' }}>
          <div>
            <strong>{translate(BUSINESS_DETAILS.companyName, locale)}</strong>
            <p>{t.footerNote}</p>
          </div>
          <a href={whatsappEstimateLink} target="_blank" rel="noreferrer">
            <MessageCircleMore size={18} />
            {t.footerWhatsapp}
          </a>
        </footer>
      </div>

      <a
        className="floating-whatsapp"
        href={whatsappEstimateLink}
        target="_blank"
        rel="noreferrer"
        aria-label={locale === 'ar' ? 'افتح واتساب' : 'Open WhatsApp'}
      >
        <MessageCircleMore size={20} />
        <span>{locale === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
      </a>
    </div>
  );
}

interface SectionHeadingProps {
  badge: string;
  title: string;
  description: string;
}

const SectionHeading = ({ badge, title, description }: SectionHeadingProps) => {
  return (
    <div className="section-heading">
      <span className="section-badge secondary-badge">
        <Languages size={16} />
        {badge}
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default App;
