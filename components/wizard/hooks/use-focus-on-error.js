// لما تطلع رسالة خطأ، نرجّع التركيز للحقل الغلطان.
//
// ليش؟ بدونه يظل التركيز ع زر "التالي"، واللي يستخدم قارئ شاشة ما
// يدري وين المشكلة — يسمع الرسالة بس ما يوصل للخانة اللي تحتاج تصليح.

import { useEffect, useRef } from 'react';

export function useFocusOnError(error) {
  const answerRef = useRef(null);

  useEffect(() => {
    if (!error || !answerRef.current) return;

    const field = answerRef.current.querySelector('button, input, select, textarea');
    if (field) field.focus();
  }, [error]);

  return answerRef;
}
