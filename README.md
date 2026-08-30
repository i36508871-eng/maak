# maak — خدمات منزلية موثوقة

تطبيق لاكتشاف وحجز مقدّمي الخدمات المنزلية الموثوقين قربيك.

## البنية

- `src/` — واجهة React + Vite + TypeScript تُنشر على GitHub Pages كتطبيق PWA.
- `worker/` — واجهة API خلفية على Cloudflare Worker تتصل بـ Supabase عبر REST (PostgREST).
- `worker/db/` — سكربتات SQL لقاعدة بيانات Supabase: `schema.sql` و`seed.sql` للمقدّمين، و`profiles.sql` و`provider-onboarding.sql` للهوية والأدوار وانضمام المقدّمين.

تُجلب بيانات المقدّمين من Supabase PostgreSQL عبر الـWorker؛ لا تُستخدم بيانات وهمية في الإنتاج.

## التشغيل محلياً

1) ثبّت اعتماديات الواجهة من جذر المشروع:

    npm install

2) شغّل الـWorker محلياً (يقرأ `.dev.vars` من جذر المشروع لقيم Supabase وADMIN_TOKEN):

    cd worker
    npm install
    npm run dev
    cd ..

3) شغّل الواجهة في طرفية ثانية من جذر المشروع:

    npm run dev

تُوجّه الواجهة طلبات `/api` إلى الـWorker محلياً عبر Vite proxy، لذا اترك `VITE_API_URL` فارغاً أثناء التطوير.

## متغيرات البيئة

انقل `.env.example` إلى `.env` وعدّلها إن لزم. لا تُلتزم أي كلمات مرور أو أسرار:

- `VITE_API_URL` — عنوان الـAPI للنسخة المنشورة (اتركه فارغاً محلياً).
- `MAAK_API_TARGET` — هدف Vite proxy أثناء التطوير (افتراضياً `http://localhost:8787`).
- `VITE_SUPABASE_URL` — رابط مشروع Supabase (publishable).
- `VITE_SUPABASE_PUBLISHABLE_KEY` — مفتاح publishable فقط، وليس service_role.

أسرار الـWorker (`SUPABASE_URL`، `SUPABASE_SERVICE_ROLE_KEY`، `ADMIN_TOKEN`) تُضبط عبر `wrangler secret put` ولا تُلتزم أبداً. راجع `DEPLOY.md` لتفاصيل النشر الكاملة.
