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

## النشر على GitHub Pages

1. من repo على GitHub: **Settings → Pages**
2. **Source:** اختر **GitHub Actions**
3. بعد كل push على `main` ينشر تلقائياً

**رابط الموقع:**
`https://moneerafahaid-collab.github.io/powr-bi-dashbo/`

## النشر على سيرفر خاص

```bash
npm run build
```

ارفع محتويات مجلد `dist` إلى السيرفر.

## شاشة العرض

- افتح الرابط في Chrome
- **F11** لملء الشاشة
- الوضع الطولي (Portrait) يُفعّل تلقائياً تخطيط شاشة العرض

## تعديل البيانات

عدّل المؤشرات في `src/app/data/simpleData.ts`
