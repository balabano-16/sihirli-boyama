
import { jsPDF } from "jspdf";
import { GeneratedImage } from "../types";

// Helper to handle special characters for standard PDF fonts (which only support ASCII/Latin-1)
const sanitizeText = (str: string): string => {
  const map: { [key: string]: string } = {
    'ğ': 'g', 'Ğ': 'G',
    'ü': 'u', 'Ü': 'U',
    'ş': 's', 'Ş': 'S',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ç': 'c', 'Ç': 'C',
  };
  return str.replace(/[ğĞüÜşŞıİöÖçÇ]/g, (match) => map[match]);
};

export const generatePDF = (childName: string, theme: string, images: GeneratedImage[], labels: any) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  
  // Sanitize inputs for PDF rendering
  const safeChildName = sanitizeText(childName);
  const safeTheme = sanitizeText(theme);
  const safeTitle = sanitizeText(labels.title);
  const safeSubtitle = sanitizeText(labels.forTemplate.replace('{name}', safeChildName));
  const safeThemeText = sanitizeText(labels.themeTemplate.replace('{theme}', safeTheme));
  const safeFooter = sanitizeText(labels.createdWith);

  // --- COVER PAGE DESIGN ---
  
  // Background color (very light gray/white)
  doc.setFillColor(252, 252, 252);
  doc.rect(0, 0, width, height, "F");

  // Decorative Border (Double Line)
  const margin = 15;
  doc.setDrawColor(79, 70, 229); // Indigo-600
  doc.setLineWidth(2);
  doc.rect(margin, margin, width - (margin * 2), height - (margin * 2), "S");
  
  doc.setDrawColor(165, 180, 252); // Indigo-200
  doc.setLineWidth(1);
  doc.rect(margin + 3, margin + 3, width - (margin * 2 + 6), height - (margin * 2 + 6), "S");

  // Title
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.setFont("helvetica", "bold");
  doc.setFontSize(42);
  doc.text(safeTitle.toUpperCase(), width / 2, 50, { align: "center" });

  // Cover Image (Use the first generated image as a preview)
  if (images.length > 0) {
    const coverImg = images[0];
    const imgWidth = 120;
    const imgHeight = 160; // Aspect ratio 3:4
    const xPos = (width - imgWidth) / 2;
    const yPos = 70;
    
    // Draw a frame around the image
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.5);
    doc.rect(xPos - 1, yPos - 1, imgWidth + 2, imgHeight + 2);
    
    doc.addImage(coverImg.base64, 'JPEG', xPos, yPos, imgWidth, imgHeight);
  }

  // "For [Name]"
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(79, 70, 229); // Indigo Color
  doc.text(safeSubtitle, width / 2, 250, { align: "center" });
  
  // Theme Description with Word Wrap
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(100, 116, 139); // Slate-500
  // Split text to ensure it doesn't overflow
  const splitTheme = doc.splitTextToSize(safeThemeText, width - 60);
  doc.text(splitTheme, width / 2, 265, { align: "center" });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(safeFooter, width / 2, height - 25, { align: "center" });

  // --- CONTENT PAGES ---
  images.forEach((img, index) => {
    doc.addPage();
    
    // Reset border for content pages (Simple single border)
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    
    // Maximize image size but keep aspect ratio
    const pageMargin = 20;
    const maxImgWidth = width - (pageMargin * 2);
    const maxImgHeight = height - (pageMargin * 2) - 20; // Space for footer
    
    doc.addImage(img.base64, 'JPEG', pageMargin, pageMargin, maxImgWidth, maxImgHeight, undefined, 'FAST');
    
    // Page number
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const pageText = `${labels.pagePrefix} ${index + 1}`;
    doc.text(sanitizeText(pageText), width / 2, height - 15, { align: "center" });
  });

  doc.save(`${safeChildName.replace(/\s+/g, '_')}_Coloring_Book.pdf`);
};
