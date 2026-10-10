// تقرأ ملف الـ PDF اللي اختاره الموظف وتحوّله إلى نص base64 عشان
// نقدر نرسله داخل الطلب. نتأكد أول شي إنه PDF فعلاً وإن حجمه ما
// يتعدى 10 ميجابايت. نشيل المقدّمة "data:...;base64," ونرجّع النص
// الصافي بس، لأن دالة savePdfToDrive في السيرفر تتوقع base64 بدونها.

export const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 ميجابايت

// ترجّع Promise فيه { base64, fileName } عند النجاح، أو ترمي خطأ
// نصّه مفتاح رسالة ('errorPdfType' أو 'errorPdfSize').
export function readPdfAsBase64(file) {
  return new Promise(function (resolve, reject) {
    var isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    if (!isPdf) {
      reject(new Error('errorPdfType'));
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      reject(new Error('errorPdfSize'));
      return;
    }

    var reader = new FileReader();
    reader.onload = function () {
      var result = String(reader.result);
      var base64 = result.slice(result.indexOf(',') + 1); // نشيل المقدّمة
      resolve({ base64: base64, fileName: file.name });
    };
    reader.onerror = function () {
      reject(new Error('errorGeneric'));
    };
    reader.readAsDataURL(file);
  });
}
