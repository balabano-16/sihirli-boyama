import { jsPDF } from "jspdf";
import { GeneratedImage } from "../types";

// PDF'e Türkçe karakter desteği sağlamak için metni görsele çeviren yardımcı fonksiyon
const textToImage = (text: string, fontSize: number, isBold: boolean, color: string, maxWidth: number): { data: string, width: number, height: number } => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return { data: '', width: 0, height: 0 };

  const scale = 4;
  const fontStyle = isBold ? 'bold' : 'normal';
  const fontFamily = "'Comic Neue', 'Inter', sans-serif";
  
  ctx.font = `${fontStyle} ${fontSize * scale}px ${fontFamily}`;
  
  // Metni satırlara böl
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width / scale < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);

  const lineHeight = fontSize * 1.4;
  const totalHeight = lines.length * lineHeight;
  
  // En uzun satırın genişliğini bul
  let maxLineWidth = 0;
  lines.forEach(line => {
    const w = ctx.measureText(line).width;
    if (w > maxLineWidth) maxLineWidth = w;
  });

  canvas.width = (maxLineWidth + 40);
  canvas.height = (totalHeight * scale * 1.2);
  
  ctx.font = `${fontStyle} ${fontSize * scale}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'center';
  
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, (index * lineHeight * scale) + (lineHeight * scale * 0.1));
  });
  
  return {
    data: canvas.toDataURL('image/png'),
    width: canvas.width / scale,
    height: canvas.height / scale
  };
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
    const safeMaxWidth = width - 40; // Sayfa kenarlarından pay bırak
    
    const titleText = labels.title;
    const subtitleText = labels.forTemplate.replace('{name}', childName);
    const themeText = labels.themeTemplate.replace('{theme}', theme);
    const footerText = labels.createdWith;

    // --- KAPAK SAYFASI ---
    doc.setFillColor(252, 252, 252);
    doc.rect(0, 0, width, height, "F");

    const margin = 15;
    doc.setDrawColor(79, 70, 229); // Indigo-600
    doc.setLineWidth(2);
    doc.rect(margin, margin, width - (margin * 2), height - (margin * 2), "S");

    // Başlık (Görsel olarak)
    const titleImg = textToImage(titleText.toUpperCase(), 28, true, '#1e293b', safeMaxWidth);
    doc.addImage(titleImg.data, 'PNG', (width - titleImg.width) / 2, 30, titleImg.width, titleImg.height);

    if (images.length > 0) {
      const coverImg = images[0];
      const imgWidth = 110;
      const imgHeight = 146; 
      const xPos = (width - imgWidth) / 2;
      const yPos = 55;
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.rect(xPos - 1, yPos - 1, imgWidth + 2, imgHeight + 2);
      
      doc.addImage(coverImg.base64, 'PNG', xPos, yPos, imgWidth, imgHeight, undefined, 'FAST');
    }

    // Alt Başlık (İsim içeren kısım)
    const subImg = textToImage(subtitleText, 22, true, '#4f46e5', safeMaxWidth);
    doc.addImage(subImg.data, 'PNG', (width - subImg.width) / 2, 210, subImg.width, subImg.height);
    
    // Tema Bilgisi (Wrapped)
    const themeImg = textToImage(themeText, 11, false, '#64748b', safeMaxWidth);
    doc.addImage(themeImg.data, 'PNG', (width - themeImg.width) / 2, 230, themeImg.width, themeImg.height);

    // Footer
    const footerImg = textToImage(footerText, 8, false, '#94a3b8', safeMaxWidth);
    doc.addImage(footerImg.data, 'PNG', (width - footerImg.width) / 2, height - 22, footerImg.width, footerImg.height);

    // --- BOYAMA SAYFALARI ---
    images.forEach((img, index) => {
      doc.addPage();
      
      const pageMargin = 15;
      const maxImgWidth = width - (pageMargin * 2);
      const maxImgHeight = height - (pageMargin * 2) - 20;
      
      doc.addImage(img.base64, 'PNG', pageMargin, pageMargin, maxImgWidth, maxImgHeight, undefined, 'MEDIUM');
      
      const pageText = `${labels.pagePrefix} ${index + 1}`;
      const pImg = textToImage(pageText, 9, false, '#94a3b8', safeMaxWidth);
      doc.addImage(pImg.data, 'PNG', (width - pImg.width) / 2, height - 15, pImg.width, pImg.height);
    });

    // Dosya ismindeki Türkçe karakterleri temizleyelim (Dosya sistemi sorun çıkarmasın diye)
    const fileName = childName.replace(/[ğĞüÜşŞıİöÖçÇ]/g, (m) => ({'ğ':'g','Ğ':'G','ü':'u','Ü':'U','ş':'s','Ş':'S','ı':'i','İ':'I','ö':'o','Ö':'O','ç':'c','Ç':'C'}[m] || m));
    doc.save(`${fileName.replace(/\s+/g, '_')}_Boyama_Kitabi.pdf`);
  } catch (error) {
    console.error("PDF oluşturma hatası:", error);
    alert("PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
  }
};