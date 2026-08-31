import { Home, Sparkles, ThumbsUp, Users, Wrench, Zap } from "lucide-react";
import type { Category } from "./types";

export const categories: Category[] = [
  { name: "السباكة", icon: Wrench, count: "" },
  { name: "الكهرباء", icon: Zap, count: "" },
  { name: "التنظيف", icon: Sparkles, count: "" },
  { name: "الصباغة", icon: Home, count: "" },
  { name: "النقل", icon: Users, count: "" },
  { name: "الصيانة", icon: ThumbsUp, count: "" },
];
