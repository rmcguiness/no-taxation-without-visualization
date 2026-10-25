'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Unit } from '@/lib/params';

interface Props {
  min: number;
  max: number;
  from: number;
  to: number;
  unit: Unit;
  showUnit?: boolean;
  shareLabel?: string;
}

/** Year range + unit controls, stored in URL query params so views are shareable. */
export default function RangeControls({
  min,
  max,
  from,
  to,
  unit,
  showUnit = true,
  shareLabel = '% of total',
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const years = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  function update(next: Partial<{ from: number; to: number; unit: Unit }>) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.from !== undefined) params.set('from', String(next.from));
    if (next.to !== undefined) params.set('to', String(next.to));
    if (next.unit !== undefined) params.set('unit', next.unit);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const unitButton = (value: Unit, label: string) => (
    <button
      type="button"
      onClick={() => update({ unit: value })}
      aria-pressed={unit === value}
      className={`rounded-md px-3 py-1.5 text-sm font-medium focus:outline-2 focus:outline-offset-2 focus:outline-accent ${
        unit === value ? 'bg-accent text-white' : 'border border-ink/20 hover:border-accent'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-lg border border-ink/10 bg-surface p-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink/70">From</span>
        <select
          value={from}
          onChange={(e) => update({ from: Number(e.target.value) })}
          className="rounded-md border border-ink/20 bg-white px-2 py-1.5"
        >
          {years.map((y) => (
            <option key={y} value={y} disabled={y > to}>
              {y}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink/70">To</span>
        <select
          value={to}
          onChange={(e) => update({ to: Number(e.target.value) })}
          className="rounded-md border border-ink/20 bg-white px-2 py-1.5"
        >
          {years.map((y) => (
            <option key={y} value={y} disabled={y < from}>
              {y}
            </option>
          ))}
        </select>
      </label>
      {showUnit && (
        <div role="group" aria-label="Unit" className="flex flex-wrap gap-2">
          {unitButton('usd', 'Dollars')}
          {unitButton('share', shareLabel)}
        </div>
      )}
    </div>
  );
}
