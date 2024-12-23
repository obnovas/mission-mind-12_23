import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Contact } from '../../types';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { useSettingsStore } from '../../store/settingsStore';
import { drawStatsCard, drawTableCard, CARD_PADDING } from './reportStyles';

export function generatePrayerWeekPDF(contacts: Contact[]) {
  const { settings } = useSettingsStore.getState();
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - (2 * CARD_PADDING);

  // Title
  doc.setFontSize(20);
  doc.text('Prayer Week Assignments', CARD_PADDING, 20);
  doc.setFontSize(12);
  doc.text(format(new Date(), 'MMMM d, yyyy'), CARD_PADDING, 30);

  // Group contacts by prayer week
  const contactsByWeek = contacts.reduce((acc, contact) => {
    if (contact.prayer_week) {
      if (!acc[contact.prayer_week]) {
        acc[contact.prayer_week] = [];
      }
      acc[contact.prayer_week].push(contact);
    }
    return acc;
  }, {} as Record<number, Contact[]>);

  // Generate week ranges
  const weekRanges = Array.from({ length: 52 }, (_, i) => {
    const weekNum = i + 1;
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const weekStart = startOfWeek(new Date(yearStart.getTime() + weekNum * 7 * 24 * 60 * 60 * 1000));
    const weekEnd = endOfWeek(weekStart);
    return {
      week: weekNum,
      dateRange: `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`,
    };
  });

  // Create table data
  const tableData = weekRanges.map(({ week, dateRange }) => {
    const weekContacts = contactsByWeek[week] || [];
    return [
      `Week ${week}`,
      dateRange,
      weekContacts.map(c => c.name).join(', ') || 'No contacts assigned'
    ];
  });

  // Draw table
  const { tableY, styles } = drawTableCard(
    doc,
    CARD_PADDING,
    40,
    contentWidth,
    {
      head: [['Week', 'Date Range', 'Contacts']],
      body: tableData,
    },
    'sage',
    'Prayer Week Schedule'
  );

  autoTable(doc, {
    startY: tableY,
    head: [['Week', 'Date Range', 'Contacts']],
    body: tableData,
    ...styles,
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 50 },
      2: { cellWidth: 'auto' },
    },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Generated on ${format(new Date(), 'MMM d, yyyy h:mm a')}`,
      CARD_PADDING,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 30,
      doc.internal.pageSize.height - 10
    );
  }

  return doc;
}