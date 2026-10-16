import type { DiagnosisResult } from '@/types';

const STORAGE_KEY = 'krushivaani_reports';

export const reportStorage = {
  getAll(): DiagnosisResult[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as DiagnosisResult[];
      return Array.isArray(parsed) ? parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : [];
    } catch {
      return [];
    }
  },

  save(report: DiagnosisResult): void {
    const all = this.getAll();
    all.unshift(report);
    // Keep last 50 reports
    const trimmed = all.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  },

  delete(id: string): void {
    const all = this.getAll().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  },

  getById(id: string): DiagnosisResult | null {
    return this.getAll().find((r) => r.id === id) ?? null;
  },
};

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
