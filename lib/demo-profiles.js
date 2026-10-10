// Synthetic identities created for this public portfolio demo.
export const demoProfiles = [
  {
    id: 'profile-01',
    nameEn: 'Leena Moss',
    nameAr: 'لينا موس',
    email: 'leena.moss@example.com',
    contact: 'DEMO-001',
    department: 'design',
    initials: 'LM',
    tone: 'sage',
  },
  {
    id: 'profile-02',
    nameEn: 'Felix Rowan',
    nameAr: 'فيليكس روان',
    email: 'felix.rowan@example.com',
    contact: 'DEMO-002',
    department: 'engineering',
    initials: 'FR',
    tone: 'sand',
  },
  {
    id: 'profile-03',
    nameEn: 'Sami Brook',
    nameAr: 'سامي بروك',
    email: 'sami.brook@example.com',
    contact: 'DEMO-003',
    department: 'people',
    initials: 'SB',
    tone: 'blue',
  },
];
export const demoReasons = {
  sick: [
    {
      id: 'sick-01',
      en: 'A fictional one-day absence with a generated supporting document.',
      ar: 'غياب وهمي ليوم واحد مع مستند نموذجي مولّد.',
    },
    {
      id: 'sick-02',
      en: 'A sample medical absence request for demonstration only.',
      ar: 'طلب غياب طبي نموذجي للعرض فقط.',
    },
  ],
  late: [
    {
      id: 'late-01',
      en: 'A sample late-arrival request for a fictional morning appointment.',
      ar: 'طلب تأخير نموذجي لموعد صباحي وهمي.',
    },
    {
      id: 'late-02',
      en: 'A fictional transport delay affecting the start of the workday.',
      ar: 'تأخير وهمي في المواصلات يؤثر على بداية يوم العمل.',
    },
  ],
  excuse: [
    {
      id: 'excuse-01',
      en: 'A sample request to leave early for a fictional appointment.',
      ar: 'طلب نموذجي للمغادرة مبكراً لموعد وهمي.',
    },
    {
      id: 'excuse-02',
      en: 'A fictional two-hour absence during the workday.',
      ar: 'استئذان وهمي لمدة ساعتين خلال يوم العمل.',
    },
  ],
  emergency: [
    {
      id: 'emergency-01',
      en: 'A sample urgent personal matter with no real details attached.',
      ar: 'ظرف شخصي عاجل نموذجي دون إرفاق تفاصيل حقيقية.',
    },
    {
      id: 'emergency-02',
      en: 'A fictional same-day absence for an unexpected appointment.',
      ar: 'غياب وهمي في اليوم نفسه لموعد غير متوقع.',
    },
  ],
  leave: [
    {
      id: 'leave-01',
      en: 'A fictional annual-leave request for the selected dates.',
      ar: 'طلب إجازة سنوية وهمي للتواريخ المحددة.',
    },
    {
      id: 'leave-02',
      en: 'A sample short break with work handed over to a fictional teammate.',
      ar: 'إجازة قصيرة نموذجية مع تسليم العمل لزميل وهمي.',
    },
  ],
};
export function findDemoProfile(id) {
  return demoProfiles.find((profile) => profile.id === id) || null;
}
export function findDemoReason(type, id) {
  return (demoReasons[type] || []).find((reason) => reason.id === id) || null;
}
export function identityForProfile(id) {
  const profile = findDemoProfile(id);
  return profile
    ? {
        profileId: id,
        employeeName: profile.nameEn,
        workEmail: profile.email,
        phone: profile.contact,
        department: profile.department,
      }
    : null;
}
