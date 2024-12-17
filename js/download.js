// ボタンがクリックされたときの処理を追加
document.getElementById('downloadPdf').addEventListener('click', function () {
  // PDFに変換する対象の要素を取得
  const content = document.getElementById('content');
  
  // html2canvasを使って要素をキャンバスとしてレンダリング
html2canvas(document.getElementById('content'), {
  useCORS: true,
  onclone: (clonedDoc) => {
    const images = clonedDoc.querySelectorAll('img');
    images.forEach((img) => {
      img.crossOrigin = 'anonymous'; 
    });
  }
}).then(canvas => {
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jspdf.jsPDF();
  const imgWidth = 190;
  const imgHeight = canvas.height * imgWidth / canvas.width;
  pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
  pdf.save('ポートフォリオ.pdf');
});
});
