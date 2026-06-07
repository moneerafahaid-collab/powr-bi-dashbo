# مؤشرات وكالة التحول الرقمي

لوحة عرض تفاعلية لـ 13 مؤشر أداء — تتبدّل تلقائياً كل 30 ثانية.

## التشغيل محلياً

```bash
npm install
npm run dev
```

## البناء للإنتاج

```bash
npm run build
npm run preview
```

## النشر

1. ارفع المشروع على GitHub
2. فعّل **GitHub Pages** من Settings → Pages → Source: GitHub Actions أو branch `main` / folder `dist`
3. أو انسخ مجلد `dist` إلى أي سيرفر (IIS, Nginx, Netlify...)

## شاشة العرض

- افتح الرابط في Chrome
- **F11** لملء الشاشة
- الوضع الطولي (Portrait) يُفعّل تلقائياً تخطيط شاشة العرض

## تعديل البيانات

عدّل المؤشرات في `src/app/data/simpleData.ts`
