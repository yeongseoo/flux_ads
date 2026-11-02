FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# SITE_URL·CONTACT_EMAIL·COMPANY_* 는 정적 페이지에 반영되므로 빌드 시점에 전달하세요.
ARG SITE_URL
ARG CONTACT_EMAIL
ARG COMPANY_NAME
ARG COMPANY_REPRESENTATIVE
ARG COMPANY_BUSINESS_NUMBER
ARG COMPANY_ADDRESS
ARG PRIVACY_OFFICER
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production NODE_NO_WARNINGS=1 DATABASE_PATH=/data/flux-ads.db
COPY --from=build /app ./
VOLUME /data
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
