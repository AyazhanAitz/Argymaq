import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { LinkButton } from "@/components/ui/Button";
import { ShieldCheck, ClipboardList, Home, Scale, Heart, FileCheck, Briefcase, Lock } from "lucide-react";

const content = {
  ru: {
    forWhom: {
      title: "Кому предназначен",
      text: "Женщинам с детьми, оказавшимся в кризисной ситуации без возможности безопасного проживания: после ухода от насилия, потери жилья или иных обстоятельств, угрожающих безопасности семьи.",
    },
    howToApply: {
      title: "Как обратиться",
      text: "Свяжитесь с Центром через форму «Получить помощь», WhatsApp или по телефону. Специалист свяжется с вами для уточнения ситуации и дальнейших шагов.",
    },
    assessment: {
      title: "Как проходит первичная оценка",
      text: "Специалист Центра проводит конфиденциальную беседу, оценивает уровень риска и совместно с вами определяет, требуется ли временное размещение и какая помощь необходима в первую очередь.",
    },
    living: { title: "Условия проживания", text: "Временное безопасное проживание на период стабилизации ситуации." },
    support: { title: "Социальное сопровождение", text: "Куратор помогает выстроить план дальнейших действий." },
    legal: { title: "Юридическая помощь", text: "Консультации по алиментам, разводу, документам и защите прав." },
    psych: { title: "Психологическая поддержка", text: "Индивидуальные консультации психолога в кризисной ситуации." },
    docs: { title: "Восстановление документов", text: "Помощь в восстановлении удостоверения личности и других документов." },
    job: { title: "Помощь с трудоустройством", text: "Подбор вакансий и подготовка к выходу на работу." },
    safety: {
      title: "Безопасность превыше всего",
      text: "Точный адрес социального дома не публикуется в открытом доступе. Адрес и детали проживания сообщаются индивидуально после первичной оценки ситуации.",
    },
  },
  kz: {
    forWhom: {
      title: "Кімге арналған",
      text: "Қауіпсіз тұру мүмкіндігі жоқ дағдарысты жағдайдағы балалы әйелдерге: зорлық-зомбылықтан кеткеннен кейін, тұрғын үйден айырылғанда немесе отбасы қауіпсіздігіне қауіп төндіретін басқа жағдайларда.",
    },
    howToApply: {
      title: "Қалай жүгіну керек",
      text: "«Көмек алу» формасы, WhatsApp немесе телефон арқылы Орталықпен байланысыңыз. Маман жағдайды нақтылау үшін сізбен хабарласады.",
    },
    assessment: {
      title: "Алғашқы бағалау қалай өтеді",
      text: "Орталық маманы құпия әңгіме өткізеді, тәуекел деңгейін бағалайды және сізбен бірге уақытша орналастыру қажет пе, қандай көмек бірінші кезекте қажет екенін анықтайды.",
    },
    living: { title: "Тұру жағдайлары", text: "Жағдай тұрақтанғанға дейінгі уақытша қауіпсіз тұру." },
    support: { title: "Әлеуметтік сүйемелдеу", text: "Куратор одан әрі әрекет жоспарын құруға көмектеседі." },
    legal: { title: "Заңгерлік көмек", text: "Алимент, ажырасу, құжаттар және құқықтарды қорғау бойынша кеңестер." },
    psych: { title: "Психологиялық қолдау", text: "Дағдарысты жағдайда психологтың жеке кеңестері." },
    docs: { title: "Құжаттарды қалпына келтіру", text: "Жеке куәлікті және басқа құжаттарды қалпына келтіруге көмек." },
    job: { title: "Жұмысқа орналасуға көмек", text: "Бос орындарды таңдау және жұмысқа шығуға дайындық." },
    safety: {
      title: "Қауіпсіздік бәрінен маңызды",
      text: "Әлеуметтік үйдің нақты мекенжайы ашық жарияланбайды. Мекенжай мен тұру егжей-тегжейі жағдайды алғашқы бағалаудан кейін жеке хабарланады.",
    },
  },
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const dict = getDictionary(locale);
  return { title: dict.crisisHome.title, description: dict.crisisHome.subtitle };
}

export default function CrisisHomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const c = content[locale];

  const blocks = [
    { icon: Home, ...c.forWhom },
    { icon: ClipboardList, ...c.howToApply },
    { icon: ShieldCheck, ...c.assessment },
    { icon: Home, ...c.living },
    { icon: Heart, ...c.support },
    { icon: Scale, ...c.legal },
    { icon: Heart, ...c.psych },
    { icon: FileCheck, ...c.docs },
    { icon: Briefcase, ...c.job },
  ];

  return (
    <Section tone="cream">
      <Container className="max-w-4xl">
        <SectionHeading title={dict.crisisHome.title} subtitle={dict.crisisHome.subtitle} align="center" />
        <Photo src={null} alt={dict.crisisHome.title} label="Кризисный социальный дом" ratio="aspect-[16/7]" className="rounded-xl2" />

        <div className="mt-8 rounded-xl2 border-2 border-terracotta-300 bg-terracotta-50 p-6">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-6 w-6 shrink-0 text-terracotta-500" />
            <div>
              <h3 className="font-display font-bold text-graphite-800">{c.safety.title}</h3>
              <p className="mt-1 text-sm text-graphite-700">{c.safety.text}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {blocks.map((b) => (
            <div key={b.title} className="flex items-start gap-3 rounded-xl2 bg-white p-5 shadow-card">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-600">
                <b.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-graphite-800">{b.title}</h3>
                <p className="mt-1 text-sm text-graphite-600">{b.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <LinkButton href={`/${locale}/get-help`} size="lg">{dict.cta.needHelp}</LinkButton>
        </div>
      </Container>
    </Section>
  );
}
