import { describe, expect, it } from 'vitest';
import { mapInspectionReports } from '../../src/lib/inspectionReports';

describe('mapInspectionReports', () => {
  it('maps pdf_url to report_url and formats the Care Compare date', () => {
    const mapped = mapInspectionReports([
      {
        id: 2,
        pdf_url:
          'https://www.medicare.gov/care-compare/inspections/pdf/nursing-home/015009/health/health-inspection?date=2022-04-09',
      },
      {
        id: 1,
        pdf_url:
          'https://www.medicare.gov/care-compare/inspections/pdf/nursing-home/015009/health/health-inspection?date=2023-03-02',
      },
    ]);

    expect(mapped).toEqual([
      {
        id: 1,
        report_date: 'March 2, 2023',
        report_url:
          'https://www.medicare.gov/care-compare/inspections/pdf/nursing-home/015009/health/health-inspection?date=2023-03-02',
        report_date_iso: '2023-03-02',
      },
      {
        id: 2,
        report_date: 'April 9, 2022',
        report_url:
          'https://www.medicare.gov/care-compare/inspections/pdf/nursing-home/015009/health/health-inspection?date=2022-04-09',
        report_date_iso: '2022-04-09',
      },
    ]);
  });

  it('keeps API-provided report_url and report_date', () => {
    const mapped = mapInspectionReports([
      {
        id: 9,
        pdf_url: 'https://example.com/report.pdf?date=2024-09-01',
        report_url: 'https://example.com/report.pdf?date=2024-09-01',
        report_date: 'September 1, 2024',
        report_date_iso: '2024-09-01',
      },
    ]);

    expect(mapped[0]).toMatchObject({
      id: 9,
      report_date: 'September 1, 2024',
      report_url: 'https://example.com/report.pdf?date=2024-09-01',
      report_date_iso: '2024-09-01',
    });
  });

  it('derives report_date_iso from an ISO report_date when report_date_iso is missing', () => {
    const mapped = mapInspectionReports([
      {
        id: 10,
        report_date: '2024-09-01',
        report_url: 'https://example.com/report.pdf',
      },
    ]);

    expect(mapped[0]).toMatchObject({
      id: 10,
      report_date: 'September 1, 2024',
      report_date_iso: '2024-09-01',
      report_url: 'https://example.com/report.pdf',
    });
  });
});
