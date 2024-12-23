import Papa from 'papaparse';

export function formatContactData(rows: any[]): string {
  return Papa.unparse(rows, {
    quotes: true,
    header: true,
    delimiter: ',',
  });
}

export function formatPrayerData(rows: any[]): string {
  return Papa.unparse(rows, {
    quotes: true,
    header: true,
    delimiter: ',',
  });
}

export function formatJourneyData(rows: any[]): string {
  return Papa.unparse(rows, {
    quotes: true,
    header: true,
    delimiter: ',',
  });
}

export function formatGroupData(rows: any[]): string {
  return Papa.unparse(rows, {
    quotes: true,
    header: true,
    delimiter: ',',
  });
}