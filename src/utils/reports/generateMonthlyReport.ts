import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Contact, CheckIn, PrayerRequest } from '../../types';
import { useSettingsStore } from '../../store/settingsStore';
import { drawStatsCard, drawTableCard, CARD_PADDING } from './reportStyles';

export async function generateMonthlyReport(
  contacts: Contact[],
  checkIns: CheckIn[],
  prayerRequests: PrayerRequest[],
  month = new Date()
) {
  const { settings } = useSettingsStore.getState();
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - (2 * CARD_PADDING);
  
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  
  // Title
  doc.setFontSize(20);
  doc.text(settings.monthlyReportTitle, CARD_PADDING, 20);
  doc.setFontSize(12);
  doc.text(format(month, 'MMMM yyyy'), CARD_PADDING, 30);

  // Filter data for the month
  const monthlyCheckIns = checkIns.filter(ci => 
    isWithinInterval(new Date(ci.check_in_date), { start: monthStart, end: monthEnd })
  );

  const monthlyPrayers = prayerRequests.filter(pr =>
    isWithinInterval(new Date(pr.created_at), { start: monthStart, end: monthEnd })
  );

  // Calculate statistics
  const completedCheckIns = monthlyCheckIns.filter(ci => ci.status === 'Completed').length;
  const missedCheckIns = monthlyCheckIns.filter(ci => ci.status === 'Missed').length;
  const answeredPrayers = monthlyPrayers.filter(pr => pr.status === 'Answered').length;
  const activePrayers = prayerRequests.filter(pr => pr.status === 'Active').length;

  // Calculate rates
  const checkInRate = monthlyCheckIns.length > 0 
    ? ((completedCheckIns / monthlyCheckIns.length) * 100).toFixed(1) 
    : '0.0';
  
  const prayerRate = monthlyPrayers.length > 0
    ? ((answeredPrayers / monthlyPrayers.length) * 100).toFixed(1)
    : '0.0';

  // Monthly Summary Card
  let currentY = 45;
  const stats = [
    `Total ${settings.checkInLabel}s: ${monthlyCheckIns.length}`,
    `Completed ${settings.checkInLabel}s: ${completedCheckIns}`,
    `Missed ${settings.checkInLabel}s: ${missedCheckIns}`,
    `${settings.checkInLabel} Completion Rate: ${checkInRate}%`,
    `New ${settings.featureLabel}: ${monthlyPrayers.length}`,
    `Answered ${settings.featureLabel}: ${answeredPrayers}`,
    `Current Active ${settings.featureLabel}: ${activePrayers}`,
    `${settings.featureLabel} Answer Rate: ${prayerRate}%`
  ];

  const summaryHeight = drawStatsCard(
    doc,
    CARD_PADDING,
    currentY,
    contentWidth,
    stats,
    'ocean',
    'Monthly Summary'
  );
  currentY += summaryHeight + CARD_PADDING;

  // Check-ins by Contact Table
  const checkInsByContact = contacts.reduce((acc, contact) => {
    const contactCheckIns = monthlyCheckIns.filter(ci => ci.contact_id === contact.id);
    if (contactCheckIns.length > 0) {
      const completed = contactCheckIns.filter(ci => ci.status === 'Completed').length;
      const total = contactCheckIns.length;
      const rate = ((completed / total) * 100).toFixed(1);
      acc.push([
        contact.name,
        total.toString(),
        completed.toString(),
        `${rate}%`,
        contactCheckIns.filter(ci => ci.status === 'Missed').length.toString()
      ]);
    }
    return acc;
  }, [] as string[][]);

  const { tableY: checkInsTableY, styles: checkInsStyles } = drawTableCard(
    doc,
    CARD_PADDING,
    currentY,
    contentWidth,
    {
      head: [[`${settings.checkInLabel}s by Contact`, 'Total', 'Completed', 'Rate', 'Missed']],
      body: checkInsByContact,
    },
    'sage',
    `Monthly ${settings.checkInLabel} Details`
  );

  autoTable(doc, {
    startY: checkInsTableY,
    head: [[`${settings.checkInLabel}s by Contact`, 'Total', 'Completed', 'Rate', 'Missed']],
    body: checkInsByContact,
    ...checkInsStyles,
  });

  currentY = (doc as any).lastAutoTable.finalY + CARD_PADDING;

  // Prayer Request Summary
  const prayersByStatus = [
    ['Active', prayerRequests.filter(pr => pr.status === 'Active').length.toString()],
    ['Answered', monthlyPrayers.filter(pr => pr.status === 'Answered').length.toString()],
    ['Archived', monthlyPrayers.filter(pr => pr.status === 'Archived').length.toString()]
  ];

  const { tableY: prayersTableY, styles: prayersStyles } = drawTableCard(
    doc,
    CARD_PADDING,
    currentY,
    contentWidth,
    {
      head: [['Status', 'Count']],
      body: prayersByStatus,
    },
    'coral',
    `${settings.featureLabel} Summary`
  );

  autoTable(doc, {
    startY: prayersTableY,
    head: [['Status', 'Count']],
    body: prayersByStatus,
    ...prayersStyles,
  });

  currentY = (doc as any).lastAutoTable.finalY + CARD_PADDING;

  // Answered Prayers List
  const answeredData = monthlyPrayers
    .filter(pr => pr.status === 'Answered')
    .map(pr => {
      const contact = contacts.find(c => c.id === pr.contact_id);
      return [
        contact?.name || 'Unknown',
        format(new Date(pr.created_at), 'MMM d'),
        format(new Date(pr.updated_at), 'MMM d'),
        pr.request,
        pr.answer_notes || ''
      ];
    });

  if (answeredData.length > 0) {
    const { tableY: answeredTableY, styles: answeredStyles } = drawTableCard(
      doc,
      CARD_PADDING,
      currentY,
      contentWidth,
      {
        head: [['Contact', 'Requested', 'Answered', 'Request', 'Answer Notes']],
        body: answeredData,
      },
      'sunset',
      `Answered ${settings.featureLabel}`
    );

    autoTable(doc, {
      startY: answeredTableY,
      head: [['Contact', 'Requested', 'Answered', 'Request', 'Answer Notes']],
      body: answeredData,
      ...answeredStyles,
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