# Multi-stage build for Next.js application
FROM node:20-bookworm-slim AS base

# Install dependencies only when needed
FROM base AS deps

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        openssl \
        python3 \
        make \
        g++ && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci --legacy-peer-deps --ignore-scripts && \
    npx prisma generate


# Build
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1

# --- Продакшн: NEXT_PUBLIC_* встраиваются в бандл только на этапе сборки ---
# См. DEPLOY.md, п. 3.1: без этих ARG значения из .env до сборки не доходят.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_PHONE_NUMBER
ARG NEXT_PUBLIC_INSTAGRAM_URL
ARG NEXT_PUBLIC_FACEBOOK_URL
ARG NEXT_PUBLIC_THREADS_URL
ARG NEXT_PUBLIC_TELEGRAM_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID} \
    NEXT_PUBLIC_WHATSAPP_NUMBER=${NEXT_PUBLIC_WHATSAPP_NUMBER} \
    NEXT_PUBLIC_PHONE_NUMBER=${NEXT_PUBLIC_PHONE_NUMBER} \
    NEXT_PUBLIC_INSTAGRAM_URL=${NEXT_PUBLIC_INSTAGRAM_URL} \
    NEXT_PUBLIC_FACEBOOK_URL=${NEXT_PUBLIC_FACEBOOK_URL} \
    NEXT_PUBLIC_THREADS_URL=${NEXT_PUBLIC_THREADS_URL} \
    NEXT_PUBLIC_TELEGRAM_URL=${NEXT_PUBLIC_TELEGRAM_URL}

RUN npm run build


# Production
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/src ./src

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN npm ci --omit=dev --legacy-peer-deps
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
RUN npx prisma generate

# --- Продакшн: каталоги для именованных томов, владелец — uid 1001 (nextjs) ---
# См. DEPLOY.md, п. 3.2: контейнер работает от nextjs, именованные тома
# монтируются в эти пути — без chown загрузки падают с EACCES.
RUN mkdir -p /app/public/uploads /app/storage/applications && \
    chown -R nextjs:nodejs /app/public/uploads /app/storage

RUN mkdir -p /home/nextjs && chown nextjs:nodejs /home/nextjs
USER nextjs
ENV HOME=/home/nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
