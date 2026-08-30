# maak — خدمات منزلية موثوقة

تطبيق لاكتشاف وحجز مقدّمي الخدمات المنزلية الموثوقين.

## البنية

- مجلد src/ — واجهة React + Vite + TypeScript (Frontend)
- مجلد server/ — Backend بسيط (Node http + SQLite) يقدّم بيانات المقدّمين عبر API،
  بتبعية تشغيل واحدة (better-sqlite3) وبدون Docker.

منذ Sprint 3، بيانات المقدّمين تأتي من قاعدة بيانات SQLite حقيقية عبر الـ Backend،
ولم تعد الواجهة تعتمد على بيانات وهمية (mock) للمقدّمين.

## التشغيل محلياً (Frontend + Backend + Database)

1) ثبّت اعتماديات الواجهة من جذر المشروع:

    npm install

2) ثبّت اعتماديات الـ Backend وازرع بيانات المقدّمين:

    cd server
    npm install
    npm run seed
    cd ..

3) شغّل الـ Backend (يبقى شاغلاً):

    cd server
    npm run dev          (الـ API على http://localhost:8787)

4) في طرفية ثانية، شغّل الواجهة من جذر المشروع:

    npm run dev          (الواجهة على http://localhost:5000)

الواجهة توجّه طلبات /api إلى الـ Backend محلياً تلقائياً عبر Vite proxy،
لذا لا حاجة لضبط VITE_API_URL محلياً. عند بدء الـ Backend أول مرة، يُنشئ ملف
قاعدة البيانات ويُزرع المقدّمون تلقائياً إن كان الجدول فارغاً.

## متغيرات البيئة

انسخ ملف .env.example إلى .env وعدّلها إن لزم. لا توجد كلمات مرور أو أسرار:

- VITE_API_URL : عنوان الـ API للنسخة المنشورة (اتركه فارغاً محلياً).
- MAAK_API_TARGET : هدف الـ Vite proxy أثناء التطوير (افتراضي http://localhost:8787).
- MAAK_PORT : منفذ الـ Backend (افتراضي 8787).
- MAAK_DB_PATH : مسار ملف قاعدة البيانات (افتراضي server/data/maak.db).
- MAAK_ALLOW_ORIGIN : أصل CORS المسموح للواجهة المنشورة (افتراضي * للجميع).

## الـ API

- GET /api/providers — كل المقدّمين (من قاعدة البيانات)
- GET /api/providers/:id — مقدّم واحد
- GET /health — حالة الـ Backend

## Build و Deploy

    npm run build        (typecheck + production build للواجهة)

الواجهة تُنشر على GitHub Pages. ملاحظة مهمة: GitHub Pages خدمة استاتيكية لا تشغّل
Backend، لذلك الـ Backend يحتاج إلى hosting خارجي ليكون متاحاً للنسخة المنشورة.
حالياً الـ Backend يعمل محلياً فقط؛ عند فتح النسخة المنشورة من GitHub Pages دون
Backend مستضاف، تعرض الواجهة حالة خطأ صريحة (وليس بيانات وهمية) لأن مصدر
المقدّمين الحقيقي هو الـ API.

## العمارة

الواجهة (src/services.ts) تجلب المقدّمين عبر fetch من /api/providers، وحالة كل
صفحة تمر عبر loading ثم success/error (hook في src/hooks/useProviders.ts). الأصناف
والحجوزات الأولية لا تزال محلية (src/data.ts) لأن هذا Sprint يخص المقدّمين فقط.
