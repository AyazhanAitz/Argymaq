import { chromium } from "playwright";

const BASE = "http://localhost:3100";
const RUNID = Date.now();
const results = [];

function log(name, ok, extra = "") {
  results.push({ name, ok, extra });
  console.log(`${ok ? "✅" : "❌"} ${name} ${extra}`);
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const context = await browser.newContext();
const page = await context.newPage();

try {
  await page.goto(`${BASE}/`);
  await page.waitForURL(/\/ru$/);
  log("root redirects to /ru", true, page.url());

  await page.goto(`${BASE}/kz`);
  log("kz homepage loads", (await page.title()).length > 0, await page.title());

  await page.goto(`${BASE}/admin/login`);
  await page.fill('input[name="email"]', "admin@argymaq.kz");
  await page.fill('input[name="password"]', "ChangeMe123!");
  await Promise.all([page.waitForURL(`${BASE}/admin`), page.click('button[type="submit"]')]);
  log("admin login succeeds", page.url() === `${BASE}/admin`, page.url());

  // News CRUD
  await page.goto(`${BASE}/admin/news/new`);
  await page.fill('input[name="titleRu"]', "Смоук-тест новость");
  await page.fill('input[name="titleKz"]', "Смоук-тест жаңалық");
  await page.fill('input[name="slug"]', `smoke-test-news-${RUNID}`);
  await page.fill('textarea[name="excerptRu"]', "Краткое описание для теста");
  await page.fill('textarea[name="excerptKz"]', "Тест үшін қысқаша сипаттама");
  await page.fill('textarea[name="bodyRu"]', "Полный текст новости для смоук-теста.");
  await page.fill('textarea[name="bodyKz"]', "Смоук-тест үшін жаңалықтың толық мәтіні.");
  await Promise.all([page.waitForURL(`${BASE}/admin/news`), page.click('button[type="submit"]')]);
  log("news created and listed", (await page.textContent("body")).includes("Смоук-тест новость"));

  await page.goto(`${BASE}/ru/news`);
  log("news visible on public /ru/news", (await page.textContent("body")).includes("Смоук-тест новость"));

  // Story + fundraiser
  await page.goto(`${BASE}/admin/stories/new`);
  await page.fill('input[name="titleRu"]', "Смоук-тест история");
  await page.fill('input[name="titleKz"]', "Смоук-тест тарихы");
  await page.fill('input[name="slug"]', `smoke-test-story-${RUNID}`);
  await page.fill('textarea[name="summaryRu"]', "Краткое summary RU");
  await page.fill('textarea[name="summaryKz"]', "Краткое summary KZ");
  await page.fill('textarea[name="problemRu"]', "Проблема RU текст для теста");
  await page.fill('textarea[name="problemKz"]', "Проблема KZ текст для теста");
  await page.fill('textarea[name="neededHelpRu"]', "юридическая помощь\nработа");
  await page.fill('textarea[name="neededHelpKz"]', "заң көмегі\nжұмыс");
  await page.fill('input[name="fundraiserGoal"]', "500000");
  await page.fill('input[name="fundraiserRaised"]', "100000");
  await page.check('input[name="isMamaOfWeek"]');
  await page.check('input[name="consentGiven"]');
  await page.check('input[name="published"]');
  await Promise.all([page.waitForURL(`${BASE}/admin/stories`), page.click('button[type="submit"]')]);
  log("story created and listed", (await page.textContent("body")).includes("Смоук-тест история"));

  await page.goto(`${BASE}/ru`);
  log("mama of week visible on homepage", (await page.textContent("body")).includes("Смоук-тест история"));

  await page.goto(`${BASE}/admin/fundraisers`);
  log("fundraiser auto-created for story", (await page.textContent("body")).includes("Смоук-тест история"));

  // Close fundraiser via story action
  await page.goto(`${BASE}/admin/stories`);
  const closeBtn = page.getByRole("button", { name: "Закрыть сбор" }).first();
  if ((await closeBtn.count()) > 0) {
    await closeBtn.click();
    await page.waitForTimeout(1000);
    await page.reload();
    log("fundraiser closed via story action", (await page.textContent("body")).includes("закрыт"));
  } else {
    log("fundraiser closed via story action", false, "button not found");
  }

  // Public Get Help form
  await page.goto(`${BASE}/ru/get-help`);
  await page.fill('input[name="fullName"]', "Тест Тестова");
  await page.fill('input[name="city"]', "Алматы");
  await page.fill('input[name="phone"]', "+77771234567");
  await page.fill('textarea[name="situationDescription"]', "Это тестовое обращение для проверки формы получения помощи.");
  await page.check('input[name="helpCategories"][value="ALIMONY"]');
  await page.check('input[name="consentPersonalData"]');
  await page.waitForTimeout(2200);
  await page.click('button[type="submit"]');
  await page.waitForSelector("text=Ваше обращение принято", { timeout: 10000 });
  const ticketText = await page.textContent("body");
  const match = ticketText.match(/AO-\d{4}-\d{5}/);
  log("get-help form submits with ticket number", !!match, match?.[0]);

  await page.goto(`${BASE}/admin/applications`);
  log("application visible in admin applications list", (await page.textContent("body")).includes("Тест Тестова"));

  const csvResp = await page.request.get(`${BASE}/api/admin/applications/export`);
  log("CSV export returns 200 for authenticated admin", csvResp.status() === 200);

  await context.clearCookies();
  const csvRespNoAuth = await page.request.get(`${BASE}/api/admin/applications/export`);
  log("CSV export returns 401 without auth", csvRespNoAuth.status() === 401);

  const adminNoAuthResp = await page.goto(`${BASE}/admin/applications`);
  log("admin route redirects to login without auth", page.url() === `${BASE}/admin/login`, page.url());

  // Re-login for remaining checks
  await page.goto(`${BASE}/admin/login`);
  await page.fill('input[name="email"]', "admin@argymaq.kz");
  await page.fill('input[name="password"]', "ChangeMe123!");
  await Promise.all([page.waitForURL(`${BASE}/admin`), page.click('button[type="submit"]')]);

  // Vacancy CRUD
  await page.goto(`${BASE}/admin/vacancies/new`);
  await page.fill('input[name="titleRu"]', "Смоук-тест вакансия");
  await page.fill('input[name="titleKz"]', "Смоук-тест бос орын");
  await page.fill('input[name="city"]', "Алматы");
  await page.fill('input[name="schedule"]', "Полный день");
  await page.fill('input[name="direction"]', "Бухгалтерия");
  await page.fill('textarea[name="descriptionRu"]', "Описание вакансии для теста");
  await page.fill('textarea[name="descriptionKz"]', "Тест үшін сипаттама");
  await Promise.all([page.waitForURL(`${BASE}/admin/vacancies`), page.click('button[type="submit"]')]);
  log("vacancy created", (await page.textContent("body")).includes("Смоук-тест вакансия"));
  await page.goto(`${BASE}/ru/jobs`);
  log("vacancy visible on public /ru/jobs", (await page.textContent("body")).includes("Смоук-тест вакансия"));

  // RU/KZ language switcher preserves path
  await page.goto(`${BASE}/ru/services`);
  await page.click('a[href="/kz/services"]');
  await page.waitForURL(`${BASE}/kz/services`);
  log("language switcher preserves path", page.url() === `${BASE}/kz/services`, page.url());

  // Mobile viewport sticky bar
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 390, height: 844 });
  await mobilePage.goto(`${BASE}/ru`);
  const stickyBarVisible = await mobilePage.locator('nav[aria-label="Быстрые действия"]').isVisible();
  log("mobile sticky action bar visible", stickyBarVisible);
  await mobilePage.close();
} catch (err) {
  console.error("SMOKE TEST ERROR:", err);
  log("unexpected error", false, String(err));
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length > 0) {
  console.log("FAILED:", failed.map((f) => f.name));
  process.exit(1);
}
