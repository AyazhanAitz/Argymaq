export interface Dictionary {
  meta: {
    siteName: string;
    orgName: string;
  };
  nav: {
    about: string;
    help: string;
    services: string;
    projects: string;
    opportunities: string;
    news: string;
    support: string;
    menu: string;
    close: string;
  };
  cta: {
    needHelp: string;
    bookConsultation: string;
    supportCenter: string;
    proposeCooperation: string;
    whatsapp: string;
    call: string;
    instagram: string;
    facebook: string;
    threads: string;
    readMore: string;
    viewAll: string;
    viewStory: string;
    support: string;
    supportCollection: string;
    apply: string;
    send: string;
    submit: string;
    becomeVolunteer: string;
    becomePartner: string;
    downloadCsv: string;
    back: string;
  };
  hero: {
    title: string;
    subtitle: string;
    tagline: string;
  };
  quickActions: {
    title: string;
  };
  services: {
    kicker: string;
    title: string;
    subtitle: string;
    items: {
      legal: { title: string; description: string };
      social: { title: string; description: string };
      psychological: { title: string; description: string };
      employment: { title: string; description: string };
      finance: { title: string; description: string };
      business: { title: string; description: string };
    };
  };
  process: {
    kicker: string;
    title: string;
    steps: { title: string; description: string }[];
  };
  mamaOfWeek: {
    kicker: string;
    title: string;
    badge: string;
    intro: string;
    problemLabel: string;
    neededLabel: string;
    goalLabel: string;
    archiveLink: string;
    consentNote: string;
    empty: string;
  };
  weeklyCycle: {
    kicker: string;
    title: string;
    steps: { title: string; description: string }[];
  };
  fundraisers: {
    title: string;
    subtitle: string;
    goal: string;
    raised: string;
    remaining: string;
    startDate: string;
    endDate: string;
    statusOpen: string;
    statusClosed: string;
    empty: string;
    paymentNotice: string;
  };
  stories: {
    title: string;
    subtitle: string;
    filters: {
      all: string;
      fundraisingOpen: string;
      inProgress: string;
      helpProvided: string;
      reportPublished: string;
    };
    empty: string;
    result: string;
    report: string;
  };
  reports: {
    title: string;
    subtitle: string;
    received: string;
    spent: string;
    balance: string;
    expenses: string;
    documents: string;
    photosBeforeAfter: string;
  };
  getHelp: {
    title: string;
    subtitle: string;
    fields: {
      fullName: string;
      city: string;
      phone: string;
      whatsapp: string;
      childrenCount: string;
      childrenAges: string;
      situation: string;
      helpType: string;
      documents: string;
      contactTime: string;
      consent: string;
    };
    successTitle: string;
    successText: string;
    ticketLabel: string;
  };
  helpCategories: Record<string, string>;
  crisisHome: {
    title: string;
    subtitle: string;
  };
  jobs: {
    title: string;
    subtitle: string;
    filters: { city: string; format: string; schedule: string; direction: string; salary: string };
    empty: string;
  };
  grants: {
    title: string;
    subtitle: string;
    empty: string;
    deadline: string;
    organizer: string;
    forWhom: string;
    funding: string;
    requirements: string;
    documentsNeeded: string;
    source: string;
  };
  projects: {
    title: string;
    subtitle: string;
    empty: string;
  };
  fleaMarket: {
    title: string;
    subtitle: string;
    statLabel: string;
  };
  kids: {
    title: string;
    subtitle: string;
  };
  helpCenter: {
    title: string;
    subtitle: string;
    options: { title: string; description: string }[];
  };
  partners: {
    title: string;
    subtitle: string;
    fields: { organization: string; name: string; phone: string; email: string; type: string; message: string };
  };
  volunteers: {
    title: string;
    subtitle: string;
    fields: { fullName: string; phone: string; whatsapp: string; email: string; city: string; specialization: string; message: string };
  };
  news: { title: string; subtitle: string; empty: string; readFull: string; share: string };
  calendar: { title: string; subtitle: string; empty: string; register: string };
  usefulInfo: { title: string; subtitle: string; searchPlaceholder: string; empty: string };
  gallery: { title: string; subtitle: string; categories: Record<string, string> };
  contacts: {
    title: string;
    address: string;
    phone: string;
    email: string;
    form: { name: string; message: string };
  };
  footer: {
    description: string;
    navTitle: string;
    servicesTitle: string;
    contactsTitle: string;
    legalTitle: string;
    privacyPolicy: string;
    terms: string;
    requisites: string;
    rights: string;
  };
  common: {
    loading: string;
    notFound: string;
    tenge: string;
    requiredField: string;
    optional: string;
    todoContent: string;
  };
}
