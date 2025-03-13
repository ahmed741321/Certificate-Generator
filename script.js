let isRotated = false; // متغير لتتبع حالة التدوير (مدورة أو لا)
CKEDITOR.replace('contentInput');

function generateCertificate() {
  let name = document.getElementById("nameInput").value;
  let course = document.getElementById("courseInput").value;
  let startDate = document.getElementById("startDateInput").value;
  let endDate = document.getElementById("endDateInput").value;
  let date = new Date().toLocaleDateString();

  // جلب المحتوى المنسق من CKEditor
  let content = CKEDITOR.instances.contentInput.getData();

  // تحديث بيانات الشهادة
  document.getElementById("studentName").innerText = name || "[Student Name]";
  document.getElementById("courseName").innerText = course || "[Course Name]";
  document.getElementById("date").innerText = date;
  document.getElementById("courseDuration").innerText = `${startDate} hasta ${endDate}`;
  document.getElementById("courseContent").innerHTML = content || "[Content Description]"; // استخدم innerHTML للحفاظ على التنسيق

  // توليد QR Code
  let qrcodeDiv = document.getElementById("qrcode");
  qrcodeDiv.innerHTML = "";
  new QRCode(qrcodeDiv, {
      text: `Student Name: ${name}\nCourse Name: ${course}\nDate: ${date}\nDuration: From ${startDate} to ${endDate}`,
      width: 100,
      height: 100,
  });
}

function downloadImage() {
  let front = document.getElementById("certificate-front");
  let back = document.getElementById("certificate-back");

  if (!front || !back) {
    console.error("Element not found!");
    return;
  }

  html2canvas(front).then((canvas1) => {
    html2canvas(back).then((canvas2) => {
      let combinedCanvas = document.createElement("canvas");
      combinedCanvas.width = Math.max(canvas1.width, canvas2.width);
      combinedCanvas.height = canvas1.height + canvas2.height;
      let ctx = combinedCanvas.getContext("2d");

      ctx.drawImage(canvas1, 0, 0);
      ctx.drawImage(canvas2, 0, canvas1.height);

      let link = document.createElement("a");
      link.href = combinedCanvas.toDataURL("image/png");
      link.download = "certificate.png";
      link.click();
    });
  });
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  let pdf = new jsPDF("l", "mm", "a4"); // الاتجاه أفقي
  
  html2canvas(document.querySelector(".certificate-front")).then((canvas1) => {
    let imgData1 = canvas1.toDataURL("image/png");
    
    // إضافة الوجه الأمامي إلى الصفحة الأولى
    pdf.addImage(imgData1, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());

    // إضافة صفحة جديدة
    pdf.addPage();

    html2canvas(document.querySelector(".certificate-back")).then((canvas2) => {
      let imgData2 = canvas2.toDataURL("image/png");

      // إضافة الوجه الخلفي إلى الصفحة الثانية
      pdf.addImage(imgData2, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());

      pdf.save("certificado.pdf");
    });
  });
}

