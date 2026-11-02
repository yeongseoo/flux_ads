# FLUX ADS — 공식 웹사이트 & 베타 파트너 모집

Next.js 15 (App Router) · React 19 · TypeScript · Node.js 내장 SQLite(`node:sqlite`)
외부 SaaS나 네이티브 DB 모듈 없이 동작합니다. **Node.js 22.13 이상**이 필요합니다.

## 페이지
| 경로 | 설명 |
|---|---|
| `/` | 메인 (Hero·Trust·Service·Process·Beta·FAQ) |
| `/service` | 서비스 소개 (현재 제공 / 개발 예정 기능 구분) |
| `/beta` | 베타 파트너 신청 (3단계 양식) |
| `/beta/success` | 신청 완료 |
| `/faq`, `/privacy`, `/terms` | FAQ · 개인정보처리방침 · 이용약관 |
| `/admin` | 관리자 (로그인 필요): 신청 관리, 상세/상태/메모, 삭제, CSV, 모집 설정 |

## 시작하기
```bash
npm install
cp .env.example .env.local
npm run admin:hash -- '12자 이상 강력한 비밀번호'   # → ADMIN_PASSWORD_HASH 에 입력
npm run secret                                      # → SESSION_SECRET 에 입력
npm run dev        # 개발
npm run build && npm start   # 운영
```

## 환경 변수 (`.env.example` 참고)
- `SITE_URL` – 실제 도메인 (canonical, OG, sitemap)
- `CONTACT_EMAIL`, `COMPANY_*`, `PRIVACY_OFFICER` – **확정된 정보만** 입력. 비어 있으면 사이트에 표시되지 않습니다.
  정적 페이지(개인정보처리방침·이용약관 등)에 반영되므로 변경 후 **다시 빌드**하세요.
- `DATABASE_PATH` – SQLite 파일 경로. 운영 시 영구 볼륨에 두고 정기 백업하세요.
- `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` – 관리자 인증. 미설정 시 관리자 로그인이 비활성화됩니다.

## 보안 및 개인정보
- 관리자: scrypt 해시 비밀번호, HMAC 서명 세션 쿠키(HttpOnly·SameSite=Strict·운영 시 Secure, 8시간), 로그인 실패 5회/15분 제한, 모든 관리자 페이지·액션·CSV 라우트에서 서버 측 인증 확인
- 신청서: 클라이언트·서버 이중 검증, 허니팟, 최소 작성 시간, IP당 시간당 5회 제한(IP는 해시로만 24시간 보관), 1회성 제출 토큰(중복 저장 방지), 동일 이메일+사이트 24시간 중복 차단
- CSV 내보내기는 수식 삽입(CSV Injection)을 방지하며 Excel 호환(UTF-8 BOM)
- 보안 헤더(X-Frame-Options, nosniff, Referrer-Policy 등), `/admin` noindex
- 운영 시 반드시 HTTPS 리버스 프록시 뒤에서 실행하세요.

## 모집 설정
`/admin/settings`에서 모집 진행/마감, 모집 목표(기본 10팀), 목표 공개 여부, 마감 안내 문구를 변경합니다.
공개 페이지에는 신청자 수나 잔여 인원을 표시하지 않습니다.

## 배포 (Docker 예시)
```bash
docker build -t flux-ads --build-arg SITE_URL=https://your-domain --build-arg CONTACT_EMAIL=you@your-domain .
docker run -d -p 3000:3000 -v flux-data:/data --env-file .env.production flux-ads
```

## 공개 전 확인 사항
- 개인정보처리방침·이용약관은 일반적인 초안입니다. 실제 사업 형태에 맞게 법률 검토 후 `lib/site.ts`의 시행일과 함께 확정하세요.
- 존재하지 않는 고객사·제휴사·실적은 표시하지 않으며, 대시보드 그래픽은 DEMO/SAMPLE로 표기되어 있습니다.
