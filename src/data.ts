import { Home, Sparkles, ThumbsUp, Users, Wrench, Zap } from "lucide-react";
import type { Booking, Category, Provider } from "./types";

export const providers: Provider[] = [
  {
    id: 1,
    name: "محمد العلوي",
    job: "سباك محترف",
    city: "طنجة",
    distance: "2.4 كم",
    price: "ابتداءً من 100 درهم",
    rating: "4.9",
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=85",
    available: true,
    services: ["إصلاح التسربات", "تركيب الصنابير", "صيانة السخانات"],
    experience: "8 سنوات",
    intro:
      "كنعاون العائلات فطنجة نحلّو مشاكل الماء بسرعة وبخدمة نقية. كنشرح المشكل قبل أي تدخل.",
  },
  {
    id: 2,
    name: "سلمى بنعيسى",
    job: "تنظيف المنازل",
    city: "طنجة",
    distance: "3.1 كم",
    price: "ابتداءً من 150 درهم",
    rating: "4.8",
    reviews: 74,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=240&q=85",
    available: true,
    services: ["تنظيف شامل", "تنظيف بعد الانتقال"],
    experience: "5 سنوات",
    intro:
      "خدمة تنظيف منظمة وموثوقة، نهتم بالتفاصيل الصغيرة ونخليو دارك مرتبة ومرتاحة.",
  },
  {
    id: 3,
    name: "ياسين المرابط",
    job: "كهربائي معتمد",
    city: "طنجة",
    distance: "4.7 كم",
    price: "ابتداءً من 120 درهم",
    rating: "4.9",
    reviews: 92,
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=240&q=85",
    available: false,
    services: ["تركيب الإنارة", "إصلاح الأعطال", "لوحات الكهرباء"],
    experience: "11 سنة",
    intro:
      "كنقدم حلول كهربائية آمنة للمنازل والمحلات بطنجة، من التشخيص حتى الإصلاح.",
  },
  {
    id: 4,
    name: "عمر التازي",
    job: "نقل وتركيب",
    city: "تطوان",
    distance: "12 كم",
    price: "ابتداءً من 250 درهم",
    rating: "4.7",
    reviews: 51,
    image:
      "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=240&q=85",
    available: true,
    services: ["نقل الأثاث", "التركيب", "التغليف"],
    experience: "6 سنوات",
    intro: "نقل الأثاث بلا صداع، من الباب للباب وبعناية.",
  },
];

export const categories: Category[] = [
  { name: "السباكة", icon: Wrench, count: "42 خدمة" },
  { name: "الكهرباء", icon: Zap, count: "38 خدمة" },
  { name: "التنظيف", icon: Sparkles, count: "56 خدمة" },
  { name: "الصباغة", icon: Home, count: "27 خدمة" },
  { name: "النقل", icon: Users, count: "31 خدمة" },
  { name: "الصيانة", icon: ThumbsUp, count: "24 خدمة" },
];

export const initialBookings: Booking[] = [
  {
    id: 11,
    service: "إصلاح تسريب في المطبخ",
    provider: "محمد العلوي",
    date: "الخميس 16 ماي",
    time: "18:00",
    location: "طنجة، النجمة",
    status: "تم القبول",
  },
];