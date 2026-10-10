// صفحة الرد اللي تظهر بالمتصفّح بعد نقر رابط الموافقة/الرفض. مو
// JSON — إنسان يقرأها مباشرة، فتصميمها بسيط: عنوان ورسالة بس.

function decisionPage(title, message) {
  var html = '<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;background:#f1ece3;padding:40px;text-align:center">'
    + '<div style="max-width:420px;margin:auto;background:#ffffff;border-radius:14px;padding:32px;box-shadow:0 2px 10px rgba(0,0,0,.08)">'
    + '<div style="font-size:20px;color:#152F4C;font-weight:bold;margin-bottom:12px">' + title + '</div>'
    + '<div style="color:#63747f;font-size:15px">' + message + '</div>'
    + '</div></div>';

  return HtmlService.createHtmlOutput(html).setTitle('FORM — طلبات الموظفين');
}
