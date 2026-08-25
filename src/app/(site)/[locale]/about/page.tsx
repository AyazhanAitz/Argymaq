import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { Section, SectionHeading, Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { LinkButton } from "@/components/ui/Button";
import { Users, ShieldCheck, HeartHandshake, Target } from "lucide-react";

const content = {
  ru: {
    title: "О Центре",
    lead: "Центр поддержки матерей «Аналарды қолдау орталығы» работает при ОФ «Фонд социального развития «Арғымақ».",
    mission:
      "Мы — мамы, которые помогают другим мамам, оказавшимся в трудной жизненной ситуации. Мы не строим коммуникацию вокруг того, как тяжело живёт женщина — мы показываем, какая у неё проблема, что мы можем сделать, как вы можете помочь и какой результат был достигнут.",
    approach:
      "Наш подход — реальная помощь, сопровождение и конкретные решения: юридическая и социальная поддержка, психологическая помощь, трудоустройство, финансовая грамотность и предпринимательство. Мы сопровождаем маму от первого обращения до решения её вопроса.",
    values: [
      { icon: ShieldCheck, title: "Достоинство", text: "Без осуждения и жалости — с уважением к каждой маме." },
      { icon: Target, title: "Результат", text: "Формула контента и работы: проблема → решение → действие → результат → отчёт." },
      { icon: HeartHandshake, title: "Прозрачность", text: "Открытая отчётность по каждому сбору и истории помощи." },
      { icon: Users, title: "Сообщество", text: "Мамы, волонтёры, специалисты и партнёры объединяются вокруг одной цели." },
    ],
    teamTitle: "Команда и специалисты",
    teamText:
      "TODO: требуется контент заказчика — имена и фотографии специалистов, юристов, психологов и координаторов Центра.",
  },
  kz: {
    title: "Орталық туралы",
    lead: "«Арғымақ» әлеуметтік даму қоры ҚҚ жанындағы Аналарды қолдау орталығы жұмыс істейді.",
    mission:
      "Біз — қиын өмірлік жағдайдағы басқа аналарға көмектесетін аналармыз. Біз әйелдің қаншалықты ауыр өмір сүретіні туралы емес, оның проблемасы қандай, біз не істей аламыз, сіз қалай көмектесе аласыз және қандай нәтижеге қол жеткізілгені туралы айтамыз.",
    approach:
      "Біздің тәсіліміз — нақты көмек, сүйемелдеу және нақты шешімдер: заңгерлік және әлеуметтік қолдау, психологиялық көмек, жұмысқа орналасу, қаржылық сауаттылық және кәсіпкерлік. Біз ананы алғашқы өтінішінен мәселесі шешілгенге дейін сүйемелдейміз.",
    values: [
      { icon: ShieldCheck, title: "Қадір-қасиет", text: "Айыптаусыз және аяусыз — әр анаға құрметпен." },
      { icon: Target, title: "Нәтиже", text: "Мазмұн мен жұмыс формуласы: проблема → шешім → әрекет → нәтиже → есеп." },
      { icon: HeartHandshake, title: "Ашықтық", text: "Әр жинақ пен көмек тарихы бойынша ашық есептілік." },
      { icon: Users, title: "Қауымдастық", text: "Аналар, еріктілер, мамандар мен серіктестер бір мақсат үшін біріктіледі." },
    ],
    teamTitle: "Команда және мамандар",
    teamText: "TODO: тапсырыс берушінің мазмұны қажет — Орталықтың мамандарының, заңгерлерінің, психологтарының аты-жөні мен фотосуреттері.",
  },
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "ru";
  const c = content[locale];
  return { title: c.title, description: c.lead };
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);
  const c = content[locale];

  return (
    <Section tone="cream">
      <Container className="max-w-4xl">
        <SectionHeading title={c.title} subtitle={c.lead} align="center" />

        <Photo src={null} alt={c.title} label="Команда и мероприятия Центра" ratio="aspect-[16/7]" className="rounded-xl2" />

        <div className="prose-content mt-8">
          <h2>{dict.hero.title}</h2>
          <p>{c.mission}</p>
          <h2>Наш подход</h2>
          <p>{c.approach}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {c.values.map((v) => (
            <div key={v.title} className="flex items-start gap-3 rounded-xl2 bg-white p-5 shadow-card">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
                <v.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-graphite-800">{v.title}</h3>
                <p className="mt-1 text-sm text-graphite-600">{v.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl2 border border-graphite-800/10 bg-sand-100 p-6">
          <h2 className="font-display text-xl font-bold text-graphite-800">{c.teamTitle}</h2>
          <p className="mt-2 text-sm text-graphite-600">{c.teamText}</p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <LinkButton href={`/${locale}/get-help`} size="lg">{dict.cta.needHelp}</LinkButton>
          <LinkButton href={`/${locale}/contacts`} variant="outline" size="lg">{dict.contacts.title}</LinkButton>
        </div>
      </Container>
    </Section>
  );
}
