# Parsayan V39 — Final Game Feel

## هدف
این نسخه فقط لایه‌ی تجربه و پرداخت نهایی را روی V38 اضافه می‌کند و منطق امتیاز، تعداد راند، ترتیب نوبت‌ها، بانک داده و قوانین بازی‌ها را تغییر نمی‌دهد.

## تغییرات
- رتبه‌بندی زنده در Scoreboard مشترک شش بازی جانبی.
- صفحه پایان مشترک و حرفه‌ای برای هر شش بازی: قهرمان/تساوی، امتیاز نهایی و جدول کامل.
- Sound/Haptic سبک برای درست، غلط و پایان بازی با کنترل روشن/خاموش مشترک.
- ترجیح Sound/Haptic در localStorage حفظ می‌شود.
- Motion کوتاه برای بازیکن فعال و صفحه قهرمان، با احترام به `prefers-reduced-motion`.
- بازی اصلی نیز کنترل FX و بازخورد درست/غلط و صدای پایان بازی را دریافت کرد.
- UI پایان بازی‌ها یکپارچه شد بدون دست‌زدن به State Machine اصلی.

## حفاظت از ساختار
- هیچ Score Rule، Timer Rule، Question Bank یا Round Rule تغییر نکرد.
- API موجود `PartySessionSetup` و `MiniScoreboard` حفظ شد.
- تست‌های V16 تا V38 بدون حذف یا تضعیف اجرا شدند.
- تست اختصاصی V39 اضافه شد.

## QA
- `npm run test:audit`: PASS
- V39 Final Game Feel: PASS (22/22)
- State Machine stress/regression قبلی: PASS در همان اجرای کامل.
- Build محلی Vite: اجرا نشد چون `node_modules` در محیط حاضر نصب نیست؛ بنابراین Build را تأییدشده اعلام نمی‌کنیم. GitHub Actions همچنان audit را قبل از build اجرا می‌کند.
