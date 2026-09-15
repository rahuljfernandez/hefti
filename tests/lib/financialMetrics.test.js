import { describe, expect, it } from 'vitest';
import {
  buildOwnerProfitStats,
  buildOwnerRevenueStats,
} from '../../src/lib/financialMetrics';

const owner = {
  cms_owner_avg_operating_margin: -10.94,
  cms_owner_total_revenue: 1426060000,
};

describe('buildOwnerStats benchmark details', () => {
  /* `median`/`stdDev` are literal values, not column names. They read 'N/A'
     because no owner benchmark data exists yet — the lines still render so the
     cards keep a stable height. */
  it('renders both benchmark lines while the values are placeholders', () => {
    const [operatingMargin] = buildOwnerProfitStats(owner, {});

    expect(operatingMargin.detail1).toBe('Median: N/A');
    expect(operatingMargin.detail2).toBe('Std Dev: N/A');
  });

  it('does not suffix a placeholder benchmark', () => {
    const [operatingMargin] = buildOwnerProfitStats(owner, {});

    expect(operatingMargin.displayValue).toBe('-10.9%');
    expect(operatingMargin.detail1).not.toContain('%');
  });

  it('formats currency metrics as currency', () => {
    const [netPatientRevenue] = buildOwnerRevenueStats(owner, {});

    expect(netPatientRevenue.displayValue).toBe('$1,426,060,000');
  });
});
