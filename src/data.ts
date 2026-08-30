import { Home, Sparkles, ThumbsUp, Users, Wrench, Zap } from "lucide-react";
import type { Booking, Category } from "./types";

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
