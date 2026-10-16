# Деплой на продакшн-сервер (Docker Compose)

Пошаговая инструкция по развёртыванию сайта Центра поддержки матерей на выделенном
сервере (VPS) в продакшне: сборка образа, Postgres, миграции, обратный прокси с TLS,
бэкапы и обновления.

Локальная разработка описана в `README.md` (раздел 1). Здесь — только продакшн.

---

## 0. Схема развёртывания

```
Интернет → :80/:443  nginx / Caddy (TLS, Let's Encrypt)
                 └─→ 127.0.0.1:3000  контейнер argymaq-app  (Next.js standalone)
                              └─→ postgres:5432  контейнер argymaq-db
```

- Приложение и БД **не публикуются наружу** — их слушает только `127.0.0.1`.
- Миграции (`prisma migrate deploy`) и сид выполняются автоматически при старте
  контейнера приложения.
- Все файлы (загруженные админом медиа и приватные документы обращений) лежат в
  именованных Docker-томах и переживают пересоздание контейнера.

---

## 1. Требования к серверу

| | Минимум | Рекомендация |
|---|---|---|
| ОС | Ubuntu 22.04/24.04 LTS (или Debian 12) | Ubuntu 24.04 LTS |
| CPU | 2 vCPU | 2–4 vCPU |
| RAM | 2 GB + swap 2 GB | 4 GB (сборка Next.js ест 2–4 GB) |
| Диск | 30 GB SSD | 40+ GB SSD |
| Домен | A-запись `argymaq.kz → IP сервера` | + AAAA для IPv6 |

Также нужны: Docker Engine + плагин `docker compose`, открытые порты 80/443.

### 1.1. Установка Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER    # затем перелогиниться
docker compose version           # должен показать версию v2.x
```

### 1.2. Брандмауэр

```bash
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
# 5432 и 3000 НЕ открываем — они доступны только с самого сервера
```

### 1.3. Swap (если RAM 2 GB)

```bash
sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 2. Получение кода на сервер

```bash
sudo mkdir -p /opt/argymaq && sudo chown $USER /opt/argymaq
git clone <URL-РЕПОЗИТОРИЯ> /opt/argymaq
cd /opt/argymaq
```

---

## 3. Что в репозитории уже подготовлено для продакшна

В репозитории лежит два compose-файла: `docker-compose.yml` — для локальной
разработки, `docker-compose.prod.yml` — для сервера (его и использует эта
инструкция). Ниже — обзор продакшн-правок, уже внесённых в код (сделаны один раз,
повторно ничего править не нужно).

### 3.1. `Dockerfile`: `NEXT_PUBLIC_*` передаются в сборку

**Зачем:** Next.js встраивает переменные `NEXT_PUBLIC_*` в клиентский бандл **на этапе
`next build`**, а не при запуске. Без `ARG`/`ENV` в секции `builder` в проде молча не
подключился бы Google Analytics, потерялись бы ссылки на Facebook/Threads/Telegram и
`NEXT_PUBLIC_SITE_URL` (sitemap/robots/JSON-LD указывали бы на дефолтный домен).

В `Dockerfile` добавлен блок `ARG NEXT_PUBLIC_*` + `ENV` между `COPY . .` и
`RUN npm run build`, а `docker-compose.prod.yml` передаёт их через `build.args`
(значения читаются из `.env` на сервере).

### 3.2. `Dockerfile`: права на запись для томов с загрузками

**Зачем:** контейнер работает от непривилегированного пользователя `nextjs` (uid 1001),
а каталоги, на которые монтируются именованные тома, иначе остаются бы правами root —
админ **не смог бы загружать картинки** (`EACCES`), и приватные документы обращений
оказались бы в несмонтированном месте (терялись бы при пересоздании контейнера).

В секции `runner` перед `USER nextjs` добавлено:

```dockerfile
RUN mkdir -p /app/public/uploads /app/storage/applications && \
    chown -R nextjs:nodejs /app/public/uploads /app/storage
```

### 3.3. `docker-compose.prod.yml`

Готовый продакшн-конфиг (создан в корне проекта). Отличия от dev-файла:

- `build.args` — `NEXT_PUBLIC_*` уходят в сборку образа (п. 3.1);
- секреты **обязательны** (`${VAR:?...}`) — без `POSTGRES_PASSWORD`, `SESSION_SECRET`
  и `SEED_ADMIN_PASSWORD` compose откажется стартовать (защита от запуска с дефолтами:
  пустой `SEED_ADMIN_PASSWORD` создал бы админа с пустым паролем);
- порты `5432` и `3000` слушают только `127.0.0.1`;
- том `storage_data:/app/storage` — приватные документы обращений (п.38 ТЗ) переживают
  пересоздание контейнера;
- `restart: unless-stopped`, healthcheck, ротация логов.

### 3.4. Включить prod-файл по умолчанию (делается на сервере)

Чтобы во всех командах ниже не писать `-f docker-compose.prod.yml`, добавьте в `.env`
(см. следующий шаг):

```
COMPOSE_FILE=docker-compose.prod.yml
```

---

## 4. Файл `.env` на сервере

```bash
cd /opt/argymaq
nano .env       # или vim
chmod 600 .env
```

Минимальное содержимое (переменные `COMPOSE_FILE` и `*_PASSWORD`/`SESSION_SECRET`
обязательны — compose намеренно упадёт без них):

```
COMPOSE_FILE=docker-compose.prod.yml

# --- Секреты (НЕ коммитить, НЕ брать из .env.example) ---
POSTGRES_PASSWORD="<длинный случайный пароль>"
SESSION_SECRET="<openssl rand -base64 48>"
SEED_ADMIN_EMAIL="admin@argymaq.kz"
SEED_ADMIN_PASSWORD="<сильный пароль администратора>"

# --- Публичные переменные (вшиваются в бандл при СБОРКЕ — п. 3.1) ---
NEXT_PUBLIC_SITE_URL="https://argymaq.kz"
NEXT_PUBLIC_GA_ID=""                      # напр. G-XXXXXXXXXX, пусто = GA выключен
NEXT_PUBLIC_PHONE_NUMBER="+7 777 113 67 14"
NEXT_PUBLIC_WHATSAPP_NUMBER="77771136714"
NEXT_PUBLIC_INSTAGRAM_URL="https://instagram.com/analardy_qoldau_ortalygy"
NEXT_PUBLIC_FACEBOOK_URL=""               # TODO: требуется от заказчика
NEXT_PUBLIC_THREADS_URL=""                # TODO: требуется от заказчика
NEXT_PUBLIC_TELEGRAM_URL=""
```

Генерация секретов:

```bash
openssl rand -base64 48    # SESSION_SECRET
openssl rand -base64 24    # POSTGRES_PASSWORD
```

> ⚠️ **Пароль БД не может быть пустым**: сид-скрипт хеширует `SEED_ADMIN_PASSWORD`
> как есть, и пустой пароль дал бы пустой пароль и в админке. Compose откажется
> стартовать без этих переменных (`:?` в конфиге) — это защита от запуска с дефолтами.

---

## 5. Сборка и первый запуск

```bash
cd /opt/argymaq

docker compose build          # сборка образа (5–15 минут)
docker compose up -d          # запуск postgres + app
docker compose logs -f app    # дождаться миграций и старта server.js
```

В логах `app` должны появиться строки Prisma (миграции применены) и затем —
приложение слушает `0.0.0.0:3000`. Проверка:

```bash
docker compose ps                       # app: healthy, postgres: healthy
curl -I http://127.0.0.1:3000/          # 307 → /ru
curl -I http://127.0.0.1:3000/ru        # 200
curl -I http://127.0.0.1:3000/kz        # 200
```

Ручной чек-лист после запуска:

- [ ] `https://<домен>/ru` открывается, корень редиректит на `/ru`
- [ ] Переключатель RU/KZ сохраняет текущий путь
- [ ] Вход в админку `/admin/login` работает (email/пароль из `.env`)
- [ ] Форма «Получить помощь» выдаёт номер вида `AO-2026-00001`,
      обращение видно в `/admin/applications`
- [ ] Загрузка картинки через админку (Новости/Галерея) работает — проверка прав тома
- [ ] Документ к обращению загружается и открывается в админке (защищённая ссылка)

> Опционально: в репозитории есть E2E-смоук-тест `scripts/smoke-test.mjs` (Playwright,
> закрывает редиректы, CRUD, формы, права доступа). Он захардкожен на
> `http://localhost:3100` и креды сида — поправьте `BASE` и логин/пароль под себя
> и запускайте с хоста, где установлен Playwright + Chromium.

---

## 6. Обратный прокси и TLS (обязательно)

### 6.1. Почему HTTPS обязателен

Админ-сессия — cookie с флагом `secure` в проде (`src/lib/auth.ts`). Браузер **не
сохранит** такую cookie по обычному HTTP на реальном домене → вход в админку не будет
работать. Плюс HTTPS нужен для форм и приватных документов. TLS также необходим, чтобы
`rate-limit` видел реальные IP (прокси обязан передавать `X-Forwarded-For`, см. ниже).

### 6.2. Вариант A — Caddy (рекомендуется: TLS и обновление сертификатов автоматом)

```bash
sudo apt install -y caddy
sudo tee /etc/caddy/Caddyfile >/dev/null <<'EOF'
argymaq.kz {
    encode gzip
    reverse_proxy 127.0.0.1:3000
}
EOF
sudo systemctl reload caddy
```

### 6.3. Вариант B — nginx + Certbot

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo tee /etc/nginx/sites-available/argymaq >/dev/null <<'EOF'
server {
    listen 80;
    server_name argymaq.kz www.argymaq.kz;

    client_max_body_size 20m;   # документы обращений до 15 МБ + multipart

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
EOF
sudo ln -sf /etc/nginx/sites-available/argymaq /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d argymaq.kz -d www.argymaq.kz
```

Финальная проверка: `curl -I https://argymaq.kz/ru` → `200`, а
`curl -I http://127.0.0.1:3000/ru` → `200` (приложение живо локально).

---

## 7. Первые действия после запуска

1. **Войти** в `/admin/login` под `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.
2. **Сменить пароль**: создать нового пользователя в `/admin/users` (роль ADMIN),
   деактивировать сид-аккаунт — либо сменить пароль напрямую в БД.
3. **Удалить демо-данные**: записи с префиксом `[Демо]` в «Мама недели / Истории» и
   «Сборы» (они не опубликованы, но в админке мешаются).
4. **Отключить автосид после первого старта** — иначе при каждом рестарте контейнера
   `npx prisma db seed` заново создаст удалённые демо-записи (upsert с `update: {}`).
   В `docker-compose.prod.yml` уберите строку `npx prisma db seed &&` из `command`,
   оставив:

   ```yaml
   command: >
     sh -c "
       npx prisma migrate deploy &&
       node server.js
     "
   ```

   Запускать сид вручную при необходимости: `docker compose run --rm app npx prisma db seed`.
5. **Заполнить контент по TODO** из `README.md`, раздел 5: статистику (`/admin/stats`),
   реквизиты, реальные фото, логотип, GA. Ничего не выдумывать — п.44/47 ТЗ.

---

## 8. Обновление на новой версии

```bash
cd /opt/argymaq
git pull
docker compose build          # при изменении NEXT_PUBLIC_* в .env — обязательно
docker compose up -d
docker compose logs -f app    # убедиться, что migrate deploy отработал
```

- `prisma migrate deploy` применяет **только недостающие** миграции (без dev-диалогов).
- Откат кода: `git checkout <тег/коммит> && docker compose build && docker compose up -d`.
- Откат БД-миграции автоматически не выполняется — **перед опасными миграциями делайте
  бэкап** (раздел 9).
- После изменения любых `NEXT_PUBLIC_*` в `.env` обязана идти пересборка
  (`docker compose build`), иначе в бандле останутся старые значения.

---

## 9. Резервное копирование и восстановление

Резервируются две вещи: **БД** и **файловые тома** (медиа + документы обращений).

```bash
sudo mkdir -p /var/backups/argymaq

# БД (ежедневно)
docker compose exec -T postgres pg_dump -U argymaq_user -d argymaq \
  | gzip > /var/backups/argymaq/$(date +%F).sql.gz

# Файловые тома (имена томов смотрите: docker volume ls)
docker run --rm \
  -v argymaq_uploads_data:/src/uploads \
  -v argymaq_storage_data:/src/storage \
  -v /var/backups/argymaq:/backup \
  alpine tar czf /backup/files-$(date +%F).tgz -C /src .
```

Задание в cron (ежедневно в 03:15):

```bash
crontab -e
```

```cron
15 3 * * * cd /opt/argymaq && mkdir -p /var/backups/argymaq && docker compose exec -T postgres pg_dump -U argymaq_user -d argymaq | gzip > /var/backups/argymaq/$(date +\%F).sql.gz
30 3 * * * find /var/backups/argymaq -name "*.gz" -mtime +30 -delete
```

> Бэкапы должны уезжать **за пределы сервера** (rclone/scp на объектное хранилище) —
> копия на том же диске сервера спасает только от случайного `DELETE`.

Восстановление БД:

```bash
gunzip -c /var/backups/argymaq/2026-10-16.sql.gz \
  | docker compose exec -T postgres psql -U argymaq_user -d argymaq
```

---

## 10. Логи и мониторинг

```bash
docker compose ps              # статус и healthcheck
docker compose logs -f app     # логи приложения
docker compose logs -f postgres
docker compose exec app npx prisma migrate status   # статус миграций
```

Ротация логов уже задана в compose (`max-size: 10m`, `max-file: 3`).
Снаружи — простой мониторинг аптайма (Uptime Kuma / UptimeRobot) на
`https://argymaq.kz/ru`.

Prisma Studio (для разовых правок в БД, только с сервера):

```bash
docker compose exec app npx prisma studio   # откроется на 5555 внутри контейнера
# для доступа снаружи добавьте временный проброс порта или работайте через psql
```

---

## 11. Чек-лист безопасности перед публичным запуском

- [ ] `SESSION_SECRET` — длинный случайный, **не** из `.env.example`
- [ ] `POSTGRES_PASSWORD` — длинный случайный, не `argymaq_password`
- [ ] Пароль сид-администратора сменён после первого входа, сид-аккаунт деактивирован
- [ ] `.env` имеет права `600` и не попадает в git (`.gitignore` покрывает)
- [ ] Порты 3000/5432 слушают только `127.0.0.1` (см. compose)
- [ ] SSH по ключам, `PasswordAuthentication no`, ufw включён (80/443/22)
- [ ] HTTPS работает, `http://` редиректит на `https://`
- [ ] Демо-записи `[Демо]` удалены, автосид из `command` убран (п. 7.4)
- [ ] Бэкапы настроены и **проверено восстановление** из копии
- [ ] TODO из `README.md` §5 закрыты: реквизиты, логотип, реальные фото, контакты
- [ ] Приватность: документы обращений доступны только через админку
      (`/api/admin/documents/...`), публичного URL у них нет

Известные ограничения (см. `README.md` §6): rate-limit in-memory и локальное
хранилище документов рассчитаны на **один** инстанс приложения — при горизонтальном
масштабировании нужны Redis и S3-совместимое хранилище.

---

## 12. Частые проблемы

| Симптом | Причина и решение |
|---|---|
| `EACCES: permission denied .../public/uploads` при загрузке картинки | Том создан до правки Dockerfile (п. 3.2) или с правами root. Проверить/починить: `docker run --rm -v argymaq_uploads_data:/d alpine chown -R 1001:1001 /d` (тома в `docker volume ls`). Затем `docker compose up -d`. |
| Не загружаются документы обращений | То же самое для тома `argymaq_storage_data`. Если файлы пропали — они не были в томе: `docker compose down -v` удаляет тома, так делать нельзя; обычный `docker compose down` данные сохраняет. |
| В проде пустые Facebook/Threads/Telegram, GA не подключён, sitemap указывает не на тот домен | `NEXT_PUBLIC_*` встраиваются **при сборке**. Нужны правки Dockerfile (п. 3.1) и `build.args` (п. 3.3), а после изменения `.env` — `docker compose build` (можно `--no-cache`). |
| Не логинится в админку, cookie «пропадает» | Идёт обращение по HTTP, а cookie `secure`. Нужен HTTPS (раздел 6). |
| `413 Request Entity Too Large` при загрузке документа | В nginx не задан `client_max_body_size 20m;` (п. 6.3). |
| Сборка падает по памяти / killed | Мало RAM. Добавьте swap (п. 1.3) и пересоберите. |
| При рестарте вернулись записи `[Демо]` | Сид бежит при каждом старте контейнера — уберите `npx prisma db seed` из `command` (п. 7.4). |
| Миграция не применилась | `docker compose logs app`, затем `docker compose exec app npx prisma migrate status`; при необходимости `docker compose run --rm app npx prisma migrate deploy`. |
| `SESSION_SECRET не задан или слишком короткий` | Переменная не попала в контейнер или короче 16 символов — проверьте `.env` и `docker compose up -d` (пересоздание контейнера обязательно, env не подхватывается «на лету»). |
| Сайт отвечает 502 у прокси | Контейнер перезагружается/собирается: `docker compose ps`, `docker compose logs app`. |
