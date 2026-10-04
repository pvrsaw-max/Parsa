export function detectMood(message: string) {
  const text = message.toLowerCase();
  if (text.includes('می‌ترسم') || text.includes('نگران') || text.includes('استرس')) return 'ANXIETY';
  if (text.includes('کامل') || text.includes('کافی نیست')) return 'PERFECTIONISM';
  if (text.includes('خسته')) return 'TIRED';
  if (text.includes('موفق') || text.includes('تمام کردم')) return 'SUCCESS';
  return 'GENERAL';
}
