export type PeriodType = '1month' | '3months' | '6months';

export interface SimpleMetrics {
  id: number;
  pageName: string;
  category: string;
  total: number;
  period: PeriodType;
  periodValue: number;
  target?: number;
  growth?: number;
}

export const PERIOD_META: Record<PeriodType, { label: string; short: string; sub: string; color: string }> = {
  '1month': { label: 'شهر', short: 'شهر', sub: 'الشهر الحالي', color: '#7c3aed' },
  '3months': { label: '3 أشهر', short: '3ش', sub: 'الربع الحالي', color: '#0284c7' },
  '6months': { label: '6 أشهر', short: '6ش', sub: 'نصف السنة', color: '#059669' }
};

export const pagesData: SimpleMetrics[] = [
  { id: 1, pageName: 'المستفيدون من الخدمات الإلكترونية', category: 'الخدمات', total: 125000, period: '6months', periodValue: 68000, target: 150000, growth: 8.5 },
  { id: 2, pageName: 'الطلبات المنجزة', category: 'العمليات', total: 89000, period: '1month', periodValue: 8500, target: 100000, growth: 12.3 },
  { id: 3, pageName: 'الزيارات للمنصة', category: 'المنصة', total: 187000, period: '3months', periodValue: 52000, target: 200000, growth: 7.2 },
  { id: 4, pageName: 'التحويلات الناجحة', category: 'العمليات', total: 65000, period: '1month', periodValue: 5800, target: 80000, growth: 15.8 },
  { id: 5, pageName: 'المعاملات الإلكترونية', category: 'الخدمات', total: 98000, period: '6months', periodValue: 53000, target: 120000, growth: 9.1 },
  { id: 6, pageName: 'الاستشارات المقدمة', category: 'الدعم', total: 142000, period: '3months', periodValue: 41000, target: 160000, growth: 6.4 },
  { id: 7, pageName: 'الشهادات الصادرة', category: 'الخدمات', total: 76000, period: '1month', periodValue: 7100, target: 90000, growth: 11.2 },
  { id: 8, pageName: 'الحجوزات المؤكدة', category: 'العمليات', total: 105000, period: '6months', periodValue: 57000, target: 130000, growth: 10.5 },
  { id: 9, pageName: 'التقييمات الإيجابية', category: 'الجودة', total: 138000, period: '3months', periodValue: 40000, target: 150000, growth: 5.9 },
  { id: 10, pageName: 'الدورات التدريبية', category: 'التدريب', total: 58000, period: '1month', periodValue: 5200, target: 70000, growth: 14.1 },
  { id: 11, pageName: 'المشاريع المكتملة', category: 'المشاريع', total: 113000, period: '6months', periodValue: 61000, target: 140000, growth: 8.8 },
  { id: 12, pageName: 'الشراكات الفعالة', category: 'الشراكات', total: 156000, period: '3months', periodValue: 45000, target: 180000, growth: 7.6 },
  { id: 13, pageName: 'الابتكارات المنفذة', category: 'الابتكار', total: 92000, period: '6months', periodValue: 50000, target: 110000, growth: 13.2 }
];

export const ROTATION_INTERVAL_MS = 30000;
