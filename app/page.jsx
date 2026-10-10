// الصفحة الرئيسية — خالية من المنطق قصداً. كل شغل النموذج داخل
// مكوّن RequestWizard عشان يبقى كل جزء له ملف واحد وواضح.

import RequestWizard from '@/components/wizard/request-wizard';

export default function HomePage() {
  return <RequestWizard />;
}
