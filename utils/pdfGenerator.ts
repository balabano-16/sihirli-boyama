import { jsPDF } from "jspdf";
import { GeneratedImage } from "../types";

// PDF standartları için özel karakterleri temizleyen yardımcı fonksiyon
const sanitizeText = (str: string): string => {
  const map: { [key: string]: string } = {
    'ğ': 'g', 'Ğ': 'G',
    'ü': 'u', 'Ü': 'U',
    'ş': 's', 'Ş': 'S',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ç': 'c', 'Ç': 'C',
  };
  return str.replace(/[ğĞüÜşŞıİöÖçÇ]/g, (match) => map[match] || match);
};

export const generatePDF = (childName: string, theme: string, images: GeneratedImage[], labels: any) => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    
    const safeChildName = sanitizeText(childName);
    const safeTheme = sanitizeText(theme);
    const safeTitle = sanitizeText(labels.title);
    const safeSubtitle = sanitizeText(labels.forTemplate.replace('{name}', safeChildName));
    const safeThemeText = sanitizeText(labels.themeTemplate.replace('{theme}', safeTheme));
    const safeFooter = sanitizeText(labels.createdWith);

    // --- KAPAK SAYFASI ---
    doc.setFillColor(252, 252, 252);
    doc.rect(0, 0, width, height, "F");

    const margin = 15;
    doc.setDrawColor(79, 70, 229); // Indigo-600
    doc.setLineWidth(2);
    doc.rect(margin, margin, width - (margin * 2), height - (margin * 2), "S");

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.text(safeTitle.toUpperCase(), width / 2, 50, { align: "center" });

    if (images.length > 0) {
      const coverImg = images[0];
      const imgWidth = 100;
      const imgHeight = 133; // 3:4 aspect ratio
      const xPos = (width - imgWidth) / 2;
      const yPos = 70;
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.rect(xPos - 1, yPos - 1, imgWidth + 2, imgHeight + 2);
      
      // ÖNEMLİ: Gemini PNG döndürdüğü için format 'PNG' olmalı
      doc.addImage(coverImg.base64, 'PNG', xPos, yPos, imgWidth, imgHeight, undefined, 'FAST');
    }

    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229);
    doc.text(safeSubtitle, width / 2, 240, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    const splitTheme = doc.splitTextToSize(safeThemeText, width - 60);
    doc.text(splitTheme, width / 2, 255, { align: "center" });

    doc.setFontSize(9);
    doc.text(safeFooter, width / 2, height - 20, { align: "center" });

    // --- BOYAMA SAYFALARI ---
    images.forEach((img, index) => {
      doc.addPage();
      
      const pageMargin = 15;
      const maxImgWidth = width - (pageMargin * 2);
      const maxImgHeight = height - (pageMargin * 2) - 20;
      
      // Resimlerin tam sığması için PNG formatında ekliyoruz
      doc.addImage(img.base64, 'PNG', pageMargin, pageMargin, maxImgWidth, maxImgHeight, undefined, 'MEDIUM');
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      const pageText = `${labels.pagePrefix} ${index + 1}`;
      doc.text(sanitizeText(pageText), width / 2, height - 10, { align: "center" });
    });

    doc.save(`${safeChildName.replace(/\s+/g, '_')}_Boyama_Kitabi.pdf`);
  } catch (error) {
    console.error("PDF oluşturma hatası:", error);
    alert("PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
  }
};