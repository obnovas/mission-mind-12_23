import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Contact, CheckIn, PrayerRequest } from '../../types';
import { useSettingsStore } from '../../store/settingsStore';
import { drawStatsCard, drawTableCard, CARD_PADDING } from './reportStyles';

export async function generateDailyReport(
  contacts: Contact[],
  checkIns: CheckIn[],
  prayerRequests: PrayerRequest[]
) {
  const { settings } = useSettingsStore.getState();
  const doc = new jsPDF();
  const today = new Date();
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - (2 * CARD_PADDING);
  
  // Title
  doc.setFontSize(20);
  doc.text(settings.dailyReportTitle, CARD_PADDING, 20);
  doc.setFontSize(12);
  doc.text(format(today, 'MMMM d, yyyy'), CARD_PADDING, 30);

  // Summary Statistics
  const todayCheckIns = checkIns.filter(ci => 
    format(new Date(ci.check_in_date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );

  const activePrayers = prayerRequests.filter(pr => pr.status === 'Active');
  const todayPrayers = prayerRequests.filter(pr =>
    format(new Date(pr.created_at), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );

  const stats = [
    `Total ${settings.checkInLabel}s Today: ${todayCheckIns.length}`,
    `New ${settings.featureLabel} Today: ${todayPrayers.length}`,
    `Answered ${settings.featureLabel} Today: ${todayPrayers.filter(pr => pr.status === 'Answered').length}`,
    `Total Active ${settings.featureLabel}: ${activePrayers.length}`,
  ];

  let currentY = 45;
  const statsHeight = drawStatsCard(
    doc,
    CARD_PADDING,
    currentY,
    contentWidth,
    stats,
    'ocean',
    'Daily Summary'
  );
  currentY += statsHeight + CARD_PADDING;

  // Today's Check-ins Table
  const checkInData = todayCheckIns.map(ci => {
    const contact = contacts.find(c => c.id === ci.contact_id);
    return [
      contact?.name || 'Unknown',
      format(new Date(ci.check_in_date), 'h:mm a'),
      ci.status,
      ci.check_in_notes || ''
    ];
  });

  const { tableY: checkInsTableY, styles: checkInsStyles } = drawTableCard(
    doc,
    CARD_PADDING,
    currentY,
    contentWidth,
    {
      head: [['Contact', 'Time', 'Status', 'Notes']],
      body: checkInData,
    },
    'sage',
    `Today's ${settings.checkInLabel}s`
  );

  autoTable(doc, {
    startY: checkInsTableY,
    head: [['Contact', 'Time', 'Status', 'Notes']],
    body: checkInData,
    ...checkInsStyles,
  });

  currentY = (doc as any).lastAutoTable.finalY + CARD_PADDING;

  // Active Prayer Requests
  const activePrayerData = activePrayers.map(pr => {
    const contact = contacts.find(c => c.id === pr.contact_id);
    return [
      contact?.name || 'Unknown',
      format(new Date(pr.created_at), 'MMM d, yyyy'),
      pr.request,
      pr.answer_notes || ''
    ];
  });

  const { tableY: prayersTableY, styles: prayersStyles } = drawTableCard(
    doc,
    CARD_PADDING,
    currentY,
    contentWidth,
    {
      head: [['Contact', 'Date', 'Request', 'Notes']],
      body: activePrayerData,
    },
    'coral',
    `Active ${settings.featureLabel}`
  );

  autoTable(doc, {
    startY: prayersTableY,
    head: [['Contact', 'Date', 'Request', 'Notes']],
    body: activePrayerData,
    ...prayersStyles,
  });

  // Today's Prayer Updates
  if (todayPrayers.length > 0) {
    currentY = (doc as any).lastAutoTable.finalY + CARD_PADDING;

    const updatesData = todayPrayers.map(pr => {
      const contact = contacts.find(c => c.id === pr.contact_id);
      return [
        contact?.name || 'Unknown',
        pr.request,
        pr.status,
        pr.answer_notes || ''
      ];
    });

    const { tableY: updatesTableY, styles: updatesStyles } = drawTableCard(
      doc,
      CARD_PADDING,
      currentY,
      contentWidth,
      {
        head: [['Contact', 'Request', 'Status', 'Notes']],
        body: updatesData,
      },
      'sunset',
      `Today's ${settings.featureLabel} Updates`
    );

    autoTable(doc, {
      startY: updatesTableY,
      head: [['Contact', 'Request', 'Status', 'Notes']],
      body: updatesData,
      ...updatesStyles,
    });
  }

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