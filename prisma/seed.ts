/**
 * Seed-скрипт.
 *
 * Наполняет базу:
 *  - одним администратором (учётные данные берутся из .env);
 *  - статистикой Центра (реальное число указано только там, где оно есть
 *    в ТЗ — "15+ тонн вещей"; остальные показатели = 0, поле динамическое,
 *    администратор заполняет его в разделе Admin → Статистика);
 *  - несколькими статьями "Полезной информации" — заголовки взяты из ТЗ
 *    дословно, тело помечено как TODO: требуется контент заказчика;
 *  - демонстрационными записями (История/Сбор/Новость/Мероприятие/Вакансия/
 *    Грант/Проект), явно помеченными префиксом "[Демо]" и опубликованными
 *    как черновик (published/false), чтобы на проде их точно не приняли за
 *    реальные кейсы. Перед запуском в продакшн эти записи нужно удалить
 *    или заменить реальными через Admin Panel.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Администратор ---
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@argymaq.kz";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: "Администратор Центра",
      role: "ADMIN",
    },
  });

  // --- Статистика Центра (п.47) ---
  const stats: Array<{
    key: string;
    labelRu: string;
    labelKz: string;
    value: number;
    suffix?: string;
  }> = [
    {
      key: "CLOTHES_TONS",
      labelRu: "вещей собрано и передано",
      labelKz: "заттар жиналып, берілді",
      value: 15,
      suffix: "+ тонн",
    },
    { key: "WOMEN_HELPED", labelRu: "женщин получили помощь", labelKz: "әйел көмек алды", value: 0, suffix: "+" },
    { key: "CONSULTATIONS", labelRu: "консультаций проведено", labelKz: "кеңес өткізілді", value: 0, suffix: "+" },
    { key: "PROJECTS_DONE", labelRu: "проектов реализовано", labelKz: "жоба жүзеге асырылды", value: 0, suffix: "+" },
    { key: "FAMILIES", labelRu: "семей поддержано", labelKz: "отбасы қолдау алды", value: 0, suffix: "+" },
    { key: "VOLUNTEERS", labelRu: "волонтёров", labelKz: "еріктілер", value: 0, suffix: "+" },
    { key: "EVENTS", labelRu: "мероприятий проведено", labelKz: "іс-шара өткізілді", value: 0, suffix: "+" },
  ];

  for (const s of stats) {
    await prisma.siteStat.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // --- Полезная информация (заголовки — дословно из ТЗ п.26) ---
  const articles: Array<{ slug: string; titleRu: string; titleKz: string; category: string }> = [
    { slug: "alimony-collection", titleRu: "Как взыскать алименты", titleKz: "Алимент өндіріп алу тәртібі", category: "Алименты" },
    { slug: "bank-account-arrest", titleRu: "Что делать при аресте банковского счёта", titleKz: "Банк шотына тыйым салынса не істеу керек", category: "Долги" },
    { slug: "how-to-get-benefits", titleRu: "Как оформить пособие", titleKz: "Жәрдемақыны қалай рәсімдеу керек", category: "Пособия" },
    { slug: "restore-documents", titleRu: "Как восстановить документы", titleKz: "Құжаттарды қалай қалпына келтіру керек", category: "Документы" },
    { slug: "registration", titleRu: "Как оформить регистрацию", titleKz: "Тіркеуді қалай рәсімдеу керек", category: "Документы" },
    { slug: "disability-questions", titleRu: "Вопросы инвалидности", titleKz: "Мүгедектік мәселелері", category: "Социальная помощь" },
    { slug: "violence-where-to-go", titleRu: "Куда обращаться при насилии", titleKz: "Зорлық-зомбылық кезінде қайда жүгіну керек", category: "Безопасность" },
    { slug: "check-enforcement-proceedings", titleRu: "Как проверить исполнительное производство", titleKz: "Атқарушылық іс жүргізуді қалай тексеру керек", category: "Долги" },
    { slug: "check-credit-history", titleRu: "Как проверить кредитную историю", titleKz: "Кредиттік тарихты қалай тексеру керек", category: "Финансовая грамотность" },
    { slug: "financial-pyramid", titleRu: "Как распознать финансовую пирамиду", titleKz: "Қаржы пирамидасын қалай тануға болады", category: "Финансовая грамотность" },
    { slug: "state-grants", titleRu: "Где искать государственные гранты", titleKz: "Мемлекеттік гранттарды қайдан іздеу керек", category: "Гранты" },
  ];

  for (const a of articles) {
    await prisma.usefulArticle.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        titleRu: a.titleRu,
        titleKz: a.titleKz,
        category: a.category,
        summaryRu: "TODO: требуется контент заказчика (краткое описание).",
        summaryKz: "TODO: тапсырыс берушінің мазмұны қажет (қысқаша сипаттама).",
        bodyRu:
          "TODO: требуется контент заказчика. Наполнить пошаговой инструкцией с ссылками на официальные ресурсы (egov.kz, суд, adilet.zan.kz и т.д.).",
        bodyKz:
          "TODO: тапсырыс берушінің мазмұны қажет. Ресми ресурстарға сілтемелермен қадамдық нұсқаулықпен толтыру керек.",
        published: false,
      },
    });
  }

  // --- Демо: История / Мама недели + Сбор (числа — иллюстративный пример из ТЗ п.8-9-11) ---
  const demoStory = await prisma.story.upsert({
    where: { slug: "demo-mama-alimony-case" },
    update: {},
    create: {
      slug: "demo-mama-alimony-case",
      titleRu: "[Демо] Мама троих детей: алименты и трудоустройство",
      titleKz: "[Демо] Үш баланың анасы: алимент және жұмысқа орналасу",
      summaryRu: "У этой мамы есть проблема. Вместе мы попробуем найти решение.",
      summaryKz: "Бұл ананың проблемасы бар. Бірге шешім табуға тырысамыз.",
      problemRu:
        "Мама одна воспитывает троих детей. Есть задолженность по алиментам, арест банковского счёта и сложности с трудоустройством.",
      problemKz:
        "Ана жалғыз үш баланы тәрбиелеп жатыр. Алимент бойынша борыш, банк шотына тыйым салынған және жұмысқа орналасуда қиындықтар бар.",
      neededHelpRu: "юридическая консультация\nпомощь с исполнительным производством\nпоиск работы\nфинансовая консультация",
      neededHelpKz: "заң кеңесі\nатқарушылық іс жүргізуге көмек\nжұмыс іздеу\nқаржылық кеңес",
      goalOfWeekRu: "Помочь решить вопрос с документами и исполнительным производством и найти подходящую работу.",
      goalOfWeekKz: "Құжаттар мен атқарушылық іс жүргізу мәселесін шешуге және қолайлы жұмыс табуға көмектесу.",
      categoryTags: ["алименты", "долги и кредиты", "трудоустройство"],
      status: "FUNDRAISING_OPEN",
      isMamaOfWeek: true,
      weekOf: new Date(),
      consentGiven: true,
      anonymized: true,
      published: false,
    },
  });

  await prisma.fundraiser.upsert({
    where: { slug: "demo-fundraiser-housing" },
    update: {},
    create: {
      slug: "demo-fundraiser-housing",
      titleRu: "[Демо] Поможем маме с тремя детьми восстановить жильё после сложной ситуации",
      titleKz: "[Демо] Үш баланың анасына қиын жағдайдан кейін тұрғын үйді қалпына келтіруге көмектесейік",
      descriptionRu:
        "Пример карточки сбора для демонстрации работы раздела «Открытые сборы» (иллюстративные цифры из ТЗ).",
      descriptionKz: "«Ашық жинақтар» бөлімінің жұмысын көрсету үшін жинақ карточкасының мысалы.",
      goalAmount: 800000,
      raisedAmount: 537500,
      startDate: new Date(),
      status: "OPEN",
      storyId: demoStory.id,
      published: false,
    },
  });

  // --- Демо: завершённая история с отчётом (числа — пример из ТЗ п.12) ---
  const demoStory2 = await prisma.story.upsert({
    where: { slug: "demo-mama-documents-job" },
    update: {},
    create: {
      slug: "demo-mama-documents-job",
      titleRu: "[Демо] Поможем маме восстановить документы и найти работу",
      titleKz: "[Демо] Анаға құжаттарын қалпына келтіруге және жұмыс табуға көмектесейік",
      summaryRu: "История №001. Помощь оказана.",
      summaryKz: "№001 тарихы. Көмек көрсетілді.",
      problemRu: "Пример завершённой истории для демонстрации раздела «Истории помощи» и «Отчёты».",
      problemKz: "«Көмек тарихтары» және «Есептер» бөлімдерін көрсету үшін аяқталған тарих мысалы.",
      neededHelpRu: "восстановление документов\nпоиск работы",
      neededHelpKz: "құжаттарды қалпына келтіру\nжұмыс іздеу",
      resultRu: "Документы восстановлены, мама трудоустроена. Собрано 320 000 ₸.",
      resultKz: "Құжаттар қалпына келтірілді, ана жұмысқа орналасты. 320 000 ₸ жиналды.",
      reportRu: "Получено: 800 000 ₸. Израсходовано: 765 000 ₸. Остаток: 35 000 ₸.",
      reportKz: "Алынды: 800 000 ₸. Жұмсалды: 765 000 ₸. Қалдық: 35 000 ₸.",
      categoryTags: ["документы", "трудоустройство"],
      status: "REPORT_PUBLISHED",
      isMamaOfWeek: false,
      consentGiven: true,
      anonymized: true,
      published: false,
    },
  });

  const demoFundraiser2 = await prisma.fundraiser.upsert({
    where: { slug: "demo-fundraiser-documents-job" },
    update: {},
    create: {
      slug: "demo-fundraiser-documents-job",
      titleRu: "[Демо] История №001 — восстановление документов и работа",
      titleKz: "[Демо] №001 тарихы — құжаттарды қалпына келтіру және жұмыс",
      descriptionRu: "Пример завершённого сбора с опубликованным отчётом.",
      descriptionKz: "Есебі жарияланған аяқталған жинақтың мысалы.",
      goalAmount: 800000,
      raisedAmount: 800000,
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
      endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      status: "CLOSED",
      storyId: demoStory2.id,
      published: false,
    },
  });

  await prisma.expense.createMany({
    data: [
      {
        fundraiserId: demoFundraiser2.id,
        titleRu: "Восстановление документов (госпошлины)",
        titleKz: "Құжаттарды қалпына келтіру (мемлекеттік баж)",
        amount: 45000,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40),
      },
      {
        fundraiserId: demoFundraiser2.id,
        titleRu: "Юридическое сопровождение",
        titleKz: "Заңгерлік сүйемелдеу",
        amount: 120000,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      },
      {
        fundraiserId: demoFundraiser2.id,
        titleRu: "Материальная помощь семье",
        titleKz: "Отбасыға материалдық көмек",
        amount: 600000,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed завершён.");
  console.log(`Admin: ${email} / пароль из SEED_ADMIN_PASSWORD (.env)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
