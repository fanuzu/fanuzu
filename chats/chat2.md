# Passport style designs

_Started 2026-08-03 08:57 UTC_

---

## User

Continuing from "디자인 결정사항 정리".

## Assistant

We were building a full landing page for FANUZU, a cosmically themed fan-contribution platform. The goal was to create a dark cosmic pink/purple one-pager that showcases their POP (community currency) system, artist partnerships, and pre-registration flow across 6 languages with full i18n support.

We made these key decisions early on: using a placeholder planet visual (swapped for the real image once uploaded), auto-detecting user language with localStorage fallback, embedding the complete pre-reg flow (artist/fandom selection, optional referral codes, 50/100 POP rewards logic, order confirmation screens), and structuring sections as: hero → POP intro → philosophy → experience → campaign → FANUZU PASSPORT → ORIGIN 100 → comparison → pre-registration → waitlist.

The current state: The landing page is feature-complete with all 6 language blocks (ko, en, ja, zh-cn, zh-tw, tr), responsive navigation (breakpoint raised to 1180px with nowrap fixes), hero badge alignment corrected, and interactive particle-to-planet animations. All sections have proper background colors, CTA buttons with POP suffixes where needed, and the pre-reg form logic handles artist/fandom input, optional referral codes, and conditional reward displays. The page has passed multiple verification rounds; the last round caught nav wrapping and badge alignment issues which we fixed.

Next steps: The verifier will confirm the latest build passes all checks. Once cleared, we can consider final polish (animation tuning, accessibility audit, or performance optimization if needed). The landing is otherwise ready for deployment.

Files involved: FANUZU Landing.dc.html, i18n.js, image-slot.js, support.js, plus the updated brief file (FANUZU_홈페이지_제작_프롬프트_최종통합본.txt).

## User

passport 느낌이 나도록 다른 스타일로 몇개 제안해주고 먼저 가능한 스타일 목록부터 나열해줘

## Assistant

_[tool: grep]_

_[tool: read_file]_

Passport 카드에 적용 가능한 스타일 방향:

1. **실물 여권 북(booklet) 스타일** — 인장/워터마크, 세리프 헤더, 재봉선 테두리, 도장(stamp) 느낌 배지, 종이 질감
2. **보딩패스/티켓 스타일** — 가로 티어링 절취선(perforation), 바코드/QR 영역, 좌우 스텁 분리
3. **홀로그램 ID카드 스타일** — 무지개빛 홀로그램 오버레이, 마이크로칩 아이콘, 얇은 서명란
4. **우주여권(Cosmic Passport) 스타일** — 별자리 도장, 궤도선 테두리, 네온 라인 그리드, 은하 워터마크
5. **미니멀 다크 멤버십카드 스타일** (현재와 유사하지만 더 정제된 버전) — 얇은 라인, 모노스페이스 필드 레이블, 미니 QR

원하는 방향 1~2개 골라주시면 그 스타일로 실제 목업 만들어 드립니다.

## User

1번 4번

## Assistant

_[tool: dc_write]_

_[tool: ready_for_verification]_

두 스타일 목업을 만들었습니다 — Style 1 (여권 북), Style 4 (우주여권). 마음에 드는 쪽 고르면 실제 카드에 적용할게요.

## User

1번

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Style 1(여권 북) 적용 완료.

