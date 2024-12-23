import jsPDF from 'jspdf';
import { colors } from '../../styles/colors';

export const CARD_PADDING = 8; // Reduced from 10
export const BORDER_RADIUS = 4; // Reduced from 5
export const LEFT_BORDER_WIDTH = 2; // Reduced from 4
export const HEADER_PADDING = 4; // New constant for header padding

export function drawCard(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  color: keyof typeof colors,
  title?: string
) {
  // Background
  doc.setFillColor(colors[color][50]);
  doc.roundedRect(x, y, width, height, BORDER_RADIUS, BORDER_RADIUS, 'F');

  // Left border
  doc.setFillColor(colors[color][500]);
  doc.rect(x, y + BORDER_RADIUS, LEFT_BORDER_WIDTH, height - (2 * BORDER_RADIUS), 'F');
  
  // Border
  doc.setDrawColor(colors.neutral[200]);
  doc.roundedRect(x, y, width, height, BORDER_RADIUS, BORDER_RADIUS, 'S');

  if (title) {
    doc.setFontSize(12); // Reduced from 14
    doc.setTextColor(colors.neutral[900]);
    doc.text(title, x + CARD_PADDING + LEFT_BORDER_WIDTH, y + HEADER_PADDING + 4);
    return HEADER_PADDING + 12; // Reduced header height
  }
  
  return 0;
}

export function drawStatsCard(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  stats: string[],
  color: keyof typeof colors,
  title?: string
) {
  const lineHeight = 7; // Reduced from 8
  const headerHeight = title ? HEADER_PADDING + 12 : 0;
  const contentHeight = (stats.length * lineHeight) + (2 * HEADER_PADDING);
  const totalHeight = headerHeight + contentHeight;

  // Draw card background and border
  drawCard(doc, x, y, width, totalHeight, color, title);

  // Draw stats
  doc.setFontSize(11); // Reduced from 12
  doc.setTextColor(colors.neutral[600]);
  stats.forEach((stat, index) => {
    doc.text(
      stat,
      x + CARD_PADDING + LEFT_BORDER_WIDTH,
      y + headerHeight + HEADER_PADDING + (index * lineHeight)
    );
  });

  return totalHeight;
}

export function drawTableCard(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  tableData: {
    head: string[][];
    body: string[][];
  },
  color: keyof typeof colors,
  title?: string
) {
  const headerHeight = drawCard(doc, x, y, width, 0, color, title);
  
  const tableY = y + headerHeight + (headerHeight ? HEADER_PADDING : 0);
  
  return {
    tableY,
    styles: {
      headStyles: {
        fillColor: colors[color][100],
        textColor: colors[color][900],
        fontSize: 11, // Reduced from 12
        cellPadding: 4, // Added explicit padding
      },
      bodyStyles: {
        fontSize: 10, // Reduced from 11
        textColor: colors.neutral[700],
        cellPadding: 4, // Added explicit padding
      },
      alternateRowStyles: {
        fillColor: colors[color][50],
      },
    },
  };
}