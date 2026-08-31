import { Home, Sparkles, ThumbsUp, Users, Wrench, Zap } from "lucide-react";
import type { Booking, Category } from "./types";

export const categories: Category[] = [
  { name: "السباكة", icon: Wrench, count: "" },
  { name: "الكهرباء", icon: Zap, count: "" },
  { name: "التنظيف", icon: Sparkles, count: "" },
  { name: "الصباغة", icon: Home, count: "" },
  { name: "النقل", icon: Users, count: "" },
  { name: "الصيانة", icon: ThumbsUp, count: "" },
];

export const initialBookings: Booking[] = [
  {
    id: 11,
    service: "إصلاح تسريب في المطبخ",
    provider: "محمد العلوي",
    date: "الخميس 16 مايو",
    time: "18:00",
    location: "طنجة، النجمة",
    status: "تم القبول",
  },
];
