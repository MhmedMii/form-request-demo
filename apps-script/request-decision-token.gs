// توكن رابط القرار: يمنع تغيير حالة الطلب لمن يخمّن الرابط. كلمة
// السر المشتركة (FORM_SHARED_SECRET) نفسها توقّع requestId + القرار
// بـ HMAC، فالرابط يعمل فقط لو صادر من رسالتنا نفسها — وما يكشف
// الكلمة، لأن HMAC اتجاه واحد.

function buildDecisionToken(requestId, action) {
  var signatureBytes = Utilities.computeHmacSha256Signature(requestId + '|' + action, getSharedSecret());
  return signatureBytes.map(function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

function isValidDecisionToken(requestId, action, token) {
  return token === buildDecisionToken(requestId, action);
}
