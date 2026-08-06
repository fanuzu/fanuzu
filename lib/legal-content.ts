import type { Lang } from './i18n';

export type LegalBlock =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'defs'; items: { term: string; text: string }[] }
  | { kind: 'table'; head: string[]; rows: string[][] };

export interface LegalArticle {
  n: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  eyebrow: string;
  title: string;
  effective: string;
  infoBoxLabel: string;
  infoBoxText: string;
  tocLabel: string;
  toc: string[];
  articles: LegalArticle[];
  contactLine: string;
  backLink: string;
}

export interface LegalContent {
  terms: LegalDoc;
  privacy: LegalDoc;
}

const EFFECTIVE_KO = '시행일: 2026년 8월 4일 · 버전 1.0';
const EFFECTIVE_EN = 'Effective: August 4, 2026 · Version 1.0';
const EFFECTIVE_JA = '施行日: 2026年8月4日 · バージョン1.0';
const EFFECTIVE_ES = 'Vigencia: 4 de agosto de 2026 · Versión 1.0';
const EFFECTIVE_ZH_HANS = '生效日期：2026年8月4日 · 版本1.0';
const EFFECTIVE_ZH_HANT = '生效日期：2026年8月4日 · 版本1.0';

export const LEGAL: Record<Lang, LegalContent> = {
  ko: {
    terms: {
      eyebrow: 'TERMS OF SERVICE',
      title: 'FANUZU 사전등록 서비스 이용약관',
      effective: EFFECTIVE_KO,
      infoBoxLabel: '중요',
      infoBoxText:
        '이 약관은 FANUZU 정식 앱 출시 전의 홈페이지 체험, 팬덤 행성 생성 신청, 사전등록, 추천 코드, POP 보상 예약, FANUZU PASSPORT 및 ORIGIN 100 후보 운영에 적용됩니다.',
      tocLabel: '목차',
      toc: [
        '1. 목적과 용어', '2. 사전등록 및 이용 자격', '3. 팬덤 행성 신청', '4. 추천 코드와 POP',
        '5. PASSPORT와 칭호', '6. 금지행위', '7. 서비스 변경 및 중단', '8. 지식재산권과 아티스트 관계',
        '9. 책임 제한', '10. 준거법 및 분쟁',
      ],
      articles: [
        {
          n: '제1조', title: '목적 및 용어',
          blocks: [
            { kind: 'p', text: '이 약관은 Fancake Inc.(이하 "회사")가 제공하는 FANUZU 사전등록 홈페이지와 관련 기능의 이용 조건을 정합니다.' },
            { kind: 'defs', items: [
              { term: 'POP', text: '팬의 시간과 행동을 기록하는 FANUZU의 비현금성 기여 포인트입니다.' },
              { term: '팬덤 행성', text: '특정 아티스트를 응원하는 팬들의 기여와 활동을 시각화한 FANUZU 내 공동 공간입니다.' },
              { term: 'FANUZU PASSPORT', text: '이용자의 참여, 기여, 캠페인, 성장 단계, 칭호 등을 표시하는 디지털 팬 ID 및 활동 기록입니다.' },
              { term: 'PLANET FOUNDER', text: '팬덤 행성 생성을 최초로 유효하게 제안한 이용자에게 부여할 수 있는 한정 역할입니다.' },
              { term: 'ORIGIN 100', text: '각 팬덤 행성에 유효하게 참여한 최초 100명에게 검증 후 부여할 수 있는 창립 칭호입니다.' },
              { term: '추천 코드', text: '사전등록 이용자를 연결하고 보상 조건을 확인하기 위한 고유 코드입니다.' },
            ] },
          ],
        },
        {
          n: '제2조', title: '사전등록 및 이용 자격',
          blocks: [{ kind: 'ul', items: [
            '사전등록은 만 14세 이상만 신청할 수 있습니다.',
            '이용자는 본인이 사용하는 유효한 이메일과 정확한 정보를 입력해야 합니다.',
            '이메일 인증, 정식 출시 후 최초 로그인 또는 계정 연동이 완료되어야 POP 지급 및 한정 칭호가 최종 확정될 수 있습니다.',
            '사전등록 자체는 정식 서비스 계정 생성, 특정 혜택의 무조건적인 지급, 서비스 출시일 또는 특정 기능 제공을 보장하지 않습니다.',
          ] }],
        },
        {
          n: '제3조', title: '팬덤 행성 생성 신청',
          blocks: [{ kind: 'ul', items: [
            '이용자는 관심 아티스트명을 입력하여 신규 팬덤 행성 생성을 신청하거나 기존 신청에 참여할 수 있습니다.',
            '동일 아티스트가 다른 이름·표기·활동명으로 중복 신청된 경우 회사는 검토 후 통합, 수정 또는 분리할 수 있습니다.',
            '팬덤 행성은 신청자 수, 권리 침해 가능성, 운영 가능성, 서비스 정책 등을 검토하여 생성됩니다.',
            'PLANET FOUNDER 표시는 최초 입력 시각만이 아니라 중복·허위·권리침해·자동화 신청 여부 등을 검증한 뒤 확정합니다.',
            '아티스트, 소속사 또는 공식 팬클럽의 요청이나 권리 침해 우려가 있는 경우 행성명, 표시 방식 또는 운영 상태가 변경될 수 있습니다.',
          ] }],
        },
        {
          n: '제4조', title: '추천 코드 및 POP 보상',
          blocks: [
            { kind: 'ul', items: [
              '추천 코드는 선택사항이며, 추천 코드 없이도 사전등록할 수 있습니다.',
              '추천 코드 없이 유효하게 사전등록하면 신규 이용자에게 50 POP이 예약됩니다.',
              '유효한 추천 코드를 입력해 사전등록하면 신규 이용자와 추천인에게 각각 100 POP이 예약됩니다.',
              'POP은 이메일 인증 및 정식 출시 후 최초 로그인 또는 계정 연동이 완료된 뒤 지급할 수 있습니다.',
              '한 신청에는 하나의 추천 코드만 적용되며, 등록 완료 후에는 원칙적으로 변경할 수 없습니다.',
              '자기 추천, 동일인 다중 계정, 허위 이메일, 자동화 가입, 코드 거래, 보상만을 목적으로 한 비정상 가입은 무효 처리됩니다.',
              '추천 수는 ORIGIN 100 순번을 앞당기지 않습니다.',
              'POP은 현금, 전자화폐, 예금, 유가증권이 아니며 현금으로 환전하거나 이용자 간 판매·양도할 수 없습니다.',
              '사전등록 POP의 사용처, 유효기간, 소진 방식은 정식 출시 정책에서 구체화되며, 이용자에게 불리한 중대한 변경은 사전 안내합니다.',
            ] },
            { kind: 'p', text: '상세 기준은 사전등록·추천·POP 운영정책에서 확인할 수 있습니다.' },
          ],
        },
        {
          n: '제5조', title: 'FANUZU PASSPORT, PLANET FOUNDER 및 ORIGIN 100',
          blocks: [{ kind: 'ul', items: [
            '홈페이지에 표시되는 PASSPORT는 정식 서비스의 예정 기능을 설명하기 위한 미리보기일 수 있습니다.',
            '패스포트의 누적 기여, 캠페인, 성장 단계, 배지는 회사가 검증한 활동 기록에 따라 표시됩니다.',
            'ORIGIN 100은 결제 금액이나 추천 수가 아니라 각 팬덤 행성에 유효하게 사전등록하고 필요한 인증을 완료한 순서를 기준으로 합니다.',
            '표시 순번은 서버 기록, 중복 통합, 부정 이용 검증, 아티스트명 통합에 따라 임시 순번과 달라질 수 있습니다.',
            '부정 가입, 서비스 정책 위반, 권리 침해 또는 행성 통합·폐쇄 사유가 있는 경우 후보 자격 또는 칭호가 취소·조정될 수 있습니다.',
            '칭호와 배지는 명예 기록이며 재산권, 경영권, 투표 지분 또는 아티스트에 대한 권리를 의미하지 않습니다.',
          ] }],
        },
        {
          n: '제6조', title: '금지행위',
          blocks: [
            { kind: 'ul', items: [
              '타인의 이메일 또는 정보를 무단 사용',
              '자기 추천, 다중 계정, 매크로, 봇, 자동화 도구 사용',
              '추천 코드 판매, 대가성 거래, 스팸 배포',
              '아티스트·소속사와 공식 제휴한 것처럼 오인시키는 행위',
              '타인의 저작권, 상표권, 성명·초상 관련 권리 침해',
              '서비스 보안 또는 정상 운영을 방해하는 행위',
            ] },
            { kind: 'p', text: '회사는 위반 신청을 취소하고 POP, 추천 실적, PASSPORT 기록 및 칭호를 무효화할 수 있습니다.' },
          ],
        },
        {
          n: '제7조', title: '서비스 변경, 출시 및 중단',
          blocks: [
            { kind: 'p', text: '회사는 개발, 심사, 법령, 제3자 플랫폼 정책, 권리관계 또는 운영상 필요에 따라 출시 일정, 기능, 명칭, 디자인, POP 정책, 캠페인 구조를 변경할 수 있습니다. 중요한 변경은 홈페이지 또는 등록 이메일을 통해 안내합니다.' },
            { kind: 'p', text: '천재지변, 장애, 해킹, 제3자 서비스 중단 등 합리적으로 통제하기 어려운 사유가 있는 경우 서비스가 일시 중단될 수 있습니다.' },
          ],
        },
        {
          n: '제8조', title: '지식재산권 및 공식 관계의 부인',
          blocks: [
            { kind: 'p', text: 'FANUZU 명칭, 로고, 화면, 자체 제작 행성 및 콘텐츠에 대한 권리는 회사에 있습니다.' },
            { kind: 'p', text: '이용자가 입력한 아티스트명은 팬덤 행성 수요 확인을 위한 식별 정보로 처리됩니다. 별도로 명시하지 않는 한 FANUZU는 해당 아티스트, 소속사, 방송사 또는 공식 팬클럽과 제휴·후원·승인 관계가 아닙니다.' },
            { kind: 'p', text: '이용자는 타인의 사진, 로고, 앨범 이미지, 영상, 팬아트 등을 권한 없이 업로드하거나 회사에 제공해서는 안 됩니다.' },
          ],
        },
        {
          n: '제9조', title: '책임 제한',
          blocks: [{ kind: 'p', text: '회사는 고의 또는 중대한 과실이 없는 한 이용자의 잘못된 정보 입력, 이메일 수신 설정, 추천 코드 오입력, 제3자 서비스 장애로 발생한 손해에 책임을 지지 않습니다. 다만 관계 법령상 배제할 수 없는 책임은 제외하지 않습니다.' }],
        },
        {
          n: '제10조', title: '준거법 및 분쟁 해결',
          blocks: [{ kind: 'p', text: '이 약관은 대한민국 법률에 따릅니다. 분쟁이 발생한 경우 회사와 이용자는 성실히 협의하며, 해결되지 않는 경우 관계 법령에 따른 관할 법원에서 해결합니다.' }],
        },
      ],
      contactLine: '문의: help@fanuzu.co.kr',
      backLink: '← FANUZU로 돌아가기',
    },
    privacy: {
      eyebrow: 'PRIVACY POLICY',
      title: '개인정보처리방침',
      effective: EFFECTIVE_KO,
      infoBoxLabel: '핵심 안내',
      infoBoxText: '이 방침은 FANUZU 사전등록 페이지에서 이메일, 관심 아티스트, 팬덤명, 입덕 연도, 언어, 추천인 코드 등을 처리하는 기준입니다. 정식 앱에서 회원가입·커뮤니티·걸음 수·광고·결제 기능이 시작되면 별도의 통합 개인정보처리방침으로 개정됩니다.',
      tocLabel: '목차',
      toc: [
        '1. 처리하는 개인정보와 목적', '2. 보유 및 이용기간', '3. 처리위탁 및 국외 이전', '4. 이용자의 권리',
        '5. 만 14세 미만 이용 제한', '6. 안전성 확보조치', '7. 쿠키와 접속정보', '8. 담당자 및 권익침해 구제', '9. 변경 고지',
      ],
      articles: [
        {
          n: '1', title: '처리하는 개인정보와 목적',
          blocks: [
            { kind: 'table', head: ['구분', '항목', '목적'], rows: [
              ['필수', '이메일, 관심 아티스트명, 이용 언어, 필수 동의(이용약관/개인정보) 여부 및 동의 일시', '사전등록 접수, 출시 알림, 신청자 식별, 중복 신청 방지, 문의 대응'],
              ['선택', '팬덤명, 입덕 연도, 추천인 코드, 마케팅 수신 동의 여부', '팬덤 행성 생성 수요 집계, 추천 관계 확인, 사전등록 POP 보상 예약, 소식·프로모션 발송'],
              ['자동 생성', '접속 일시, IP 주소, 브라우저·기기 정보, 언어 설정, 서비스 이용기록, 오류 로그', '보안, 부정·중복 신청 탐지, 장애 대응, 서비스 품질 개선'],
              ['사전등록 결과', '사전등록 순번, 아티스트별 참여 순번, 생성된 추천 코드, POP 보상 예약 상태, ORIGIN 100 후보 여부', '사전등록 결과 제공, 정식 출시 후 계정 연동 및 혜택 검증'],
            ] },
            { kind: 'p', text: '추천인 코드와 마케팅 수신 동의는 선택사항이며, 동의하지 않아도 사전등록할 수 있습니다. 회사는 주민등록번호, 결제정보, 정밀 위치정보를 사전등록 단계에서 수집하지 않습니다.' },
          ],
        },
        {
          n: '2', title: '보유 및 이용기간',
          blocks: [
            { kind: 'ul', items: [
              '사전등록 정보: 정식 출시 알림 발송 및 혜택 연동이 완료된 날부터 30일 이내 파기합니다.',
              '정식 앱 계정으로 연동한 정보: 이용자의 별도 동의를 받아 앱 계정 정보로 이전하며, 이후에는 정식 앱 개인정보처리방침에 따릅니다.',
              '동의 철회 또는 삭제 요청 시: 법령상 보관 의무가 없는 한 지체 없이 파기합니다.',
              '부정 이용 및 분쟁 대응 기록: 필요한 최소 범위에서 관련 분쟁이 종료될 때까지 보관할 수 있습니다.',
              '관계 법령이 별도 보존기간을 정한 경우: 해당 법령에서 정한 기간 동안 보관합니다.',
            ] },
            { kind: 'p', text: '보유 목적이 달성되면 전자적 파일은 복구하기 어려운 방법으로 삭제합니다.' },
          ],
        },
        {
          n: '3', title: '개인정보 처리위탁 및 국외 이전',
          blocks: [
            { kind: 'p', text: '회사는 안정적인 웹 서비스 운영을 위해 다음 사업자를 이용합니다. 실제 적용 사업자나 처리 위치가 변경되는 경우 이 방침을 갱신합니다.' },
            { kind: 'table', head: ['수탁자', '업무', '이전 국가·시점·방법', '보유기간'], rows: [
              ['Vercel Inc.', '웹 호스팅, 배포, 요청 처리, 보안 및 오류 로그', '미국 및 Vercel 하위처리자 운영 국가 / 홈페이지 접속 및 폼 요청 시 암호화된 네트워크 전송', '서비스 제공 계약 기간 또는 목적 달성 시까지'],
              ['Supabase Inc.', '데이터베이스, 사전등록 정보 저장, 보안 운영', '프로젝트 데이터는 서울 리전 사용을 원칙으로 하며, 운영·지원 과정에서 미국 등 하위처리자 운영 국가에서 제한적으로 처리될 수 있음 / 폼 제출 시 암호화 전송', '사전등록 정보 보유기간 또는 계약 종료 시까지'],
            ] },
            { kind: 'p', text: '이용자는 국외 이전에 동의하지 않을 수 있으나, 이 경우 사전등록 제출이 제한될 수 있습니다. 국외 이전에 관한 문의 또는 동의 철회는 help@fanuzu.co.kr로 요청할 수 있습니다.' },
            { kind: 'p', text: '현재 별도의 이메일 발송업체는 확정되지 않았습니다(TODO). 도입 시 업체명, 이전 국가, 처리 목적과 보유기간을 사전에 공개합니다.' },
          ],
        },
        {
          n: '4', title: '이용자의 권리와 행사 방법',
          blocks: [
            { kind: 'p', text: '이용자는 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지, 동의 철회(마케팅 수신 철회 포함)를 요청할 수 있습니다. 요청은 help@fanuzu.co.kr로 보내면 본인 확인 후 처리합니다.' },
            { kind: 'p', text: '추천인 코드 적용, POP 보상 예약, ORIGIN 100 후보 순번은 개인정보 정정과 별개로 운영정책 및 부정 이용 검증 결과에 따라 조정될 수 있습니다.' },
          ],
        },
        {
          n: '5', title: '만 14세 미만 이용 제한',
          blocks: [{ kind: 'p', text: 'FANUZU 사전등록은 만 14세 이상만 이용할 수 있습니다. 회사가 만 14세 미만의 신청임을 확인하면 해당 신청과 관련 정보를 지체 없이 삭제합니다. 정식 서비스에서는 국가별 동의 연령 기준에 따라 법정대리인 동의 절차를 추가로 검토합니다.' }],
        },
        {
          n: '6', title: '안전성 확보조치',
          blocks: [{ kind: 'ul', items: [
            '전송 구간 암호화(HTTPS)',
            '관리 권한 최소화 및 접근 통제',
            '비밀키와 관리자 키의 소스코드 분리',
            '로그 및 부정 가입 탐지, IP 기반 요청 빈도 제한',
            '정기적인 취약점 점검과 데이터 최소 수집',
          ] }],
        },
        {
          n: '7', title: '쿠키 및 유사 기술',
          blocks: [{ kind: 'p', text: '홈페이지는 언어 선택 저장 등 필수 기능을 위해 브라우저 로컬 저장소를 사용합니다. 현재 분석·광고 등 비필수 쿠키는 사용하지 않습니다. 향후 도입하는 경우 동의 배너와 거부 방법을 이 방침에 추가합니다.' }],
        },
        {
          n: '8', title: '개인정보 보호 담당자 및 권익침해 구제',
          blocks: [
            { kind: 'p', text: 'Fancake Inc. / 대표자 Syvia Hong / 사업자등록번호 2748603844' },
            { kind: 'p', text: '117, Bundangnaegok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea' },
            { kind: 'p', text: '고객문의: help@fanuzu.co.kr / 개인정보 보호 담당자: 이지민' },
            { kind: 'p', text: '개인정보 침해 상담이 필요한 경우 개인정보침해신고센터(국번 없이 118), 개인정보분쟁조정위원회 등 관계 기관에 도움을 요청할 수 있습니다.' },
          ],
        },
        {
          n: '9', title: '방침의 변경',
          blocks: [{ kind: 'p', text: '이 방침의 내용이 변경되는 경우 시행일 최소 7일 전에 홈페이지를 통해 알립니다. 이용자 권리에 중대한 영향을 주는 변경은 합리적인 기간을 두고 별도로 안내합니다.' }],
        },
      ],
      contactLine: '문의: help@fanuzu.co.kr',
      backLink: '← FANUZU로 돌아가기',
    },
  },

  en: {
    terms: {
      eyebrow: 'TERMS OF SERVICE',
      title: "FANUZU Pre-Registration Terms of Service",
      effective: EFFECTIVE_EN,
      infoBoxLabel: 'Important',
      infoBoxText: "These Terms apply to the FANUZU website experience, fandom planet creation requests, pre-registration, referral codes, reserved POP rewards, and the FANUZU PASSPORT and ORIGIN 100 candidacy shown before the full app launches.",
      tocLabel: 'Contents',
      toc: [
        '1. Purpose and Definitions', '2. Pre-Registration and Eligibility', '3. Fandom Planet Requests', '4. Referral Codes and POP',
        '5. PASSPORT and Titles', '6. Prohibited Conduct', '7. Service Changes and Suspension', '8. Intellectual Property and Artist Relationship',
        '9. Limitation of Liability', '10. Governing Law and Disputes',
      ],
      articles: [
        {
          n: 'Article 1', title: 'Purpose and Definitions',
          blocks: [
            { kind: 'p', text: 'These Terms set out the conditions for using the FANUZU pre-registration website and related features provided by Fancake Inc. ("the Company").' },
            { kind: 'defs', items: [
              { term: 'POP', text: "FANUZU's non-cash contribution point that records a fan's time and actions." },
              { term: 'Fandom Planet', text: 'A shared space within FANUZU that visualizes the contributions and activity of fans supporting a specific artist.' },
              { term: 'FANUZU PASSPORT', text: "A digital fan ID and activity record showing a user's participation, contribution, campaigns, growth stages, and titles." },
              { term: 'PLANET FOUNDER', text: 'A limited role that may be granted to the user who first validly proposed a fandom planet.' },
              { term: 'ORIGIN 100', text: 'A founding title that may be granted, after verification, to the first 100 people who validly took part in a given fandom planet.' },
              { term: 'Referral Code', text: 'A unique code used to connect pre-registered users and determine reward eligibility.' },
            ] },
          ],
        },
        {
          n: 'Article 2', title: 'Pre-Registration and Eligibility',
          blocks: [{ kind: 'ul', items: [
            'Pre-registration is open only to those aged 14 or older.',
            'Users must provide a valid email address they control and accurate information.',
            'POP payouts and any limited titles are only finalized after email verification and first login or account linking once the full service launches.',
            'Pre-registration itself does not guarantee creation of a full-service account, unconditional delivery of any benefit, a launch date, or any specific feature.',
          ] }],
        },
        {
          n: 'Article 3', title: 'Fandom Planet Requests',
          blocks: [{ kind: 'ul', items: [
            'Users may request the creation of a new fandom planet by entering an artist name, or join an existing request.',
            'If the same artist is requested under different names, spellings, or stage names, the Company may review and merge, correct, or split those requests.',
            'A fandom planet is created after review of factors such as the number of requesters, potential rights infringement, operational feasibility, and service policy.',
            'The PLANET FOUNDER designation is finalized only after verifying against duplicate, false, rights-infringing, or automated requests — not solely by earliest submission time.',
            "A planet's name, display, or operating status may change at the request of the artist, their agency, or an official fan club, or where rights infringement is a concern.",
          ] }],
        },
        {
          n: 'Article 4', title: 'Referral Codes and POP Rewards',
          blocks: [
            { kind: 'ul', items: [
              'A referral code is optional; pre-registration is possible without one.',
              'Valid pre-registration without a referral code reserves 50 POP for the new user.',
              'Valid pre-registration with a valid referral code reserves 100 POP for both the new user and the referrer.',
              'POP may be paid out only after email verification and first login or account linking once the full service launches.',
              'Only one referral code may be applied per application, and it generally cannot be changed after registration is complete.',
              'Self-referral, multiple accounts by the same person, false email addresses, automated sign-ups, code trading, and sign-ups made solely to farm rewards are treated as invalid.',
              'Referral counts do not move up a user\'s ORIGIN 100 order.',
              'POP is not cash, e-money, a deposit, or a security, and cannot be exchanged for cash or sold/transferred between users.',
              "Where POP can be used, its validity period, and how it is spent will be detailed in the full-service policy; material changes unfavorable to users will be announced in advance.",
            ] },
            { kind: 'p', text: 'Detailed criteria are available in the Pre-Registration, Referral, and POP Operating Policy.' },
          ],
        },
        {
          n: 'Article 5', title: 'FANUZU PASSPORT, PLANET FOUNDER, and ORIGIN 100',
          blocks: [{ kind: 'ul', items: [
            'The PASSPORT shown on the website may be a preview illustrating a planned feature of the full service.',
            "A passport's accumulated contribution, campaigns, growth stage, and badges are shown based on activity records verified by the Company.",
            'ORIGIN 100 is based on the order in which a user validly pre-registered and completed the required verification for a given fandom planet — not payment amount or referral count.',
            'Displayed order numbers may differ from provisional numbers due to server records, duplicate merges, fraud verification, or artist-name consolidation.',
            'Candidacy or a title may be revoked or adjusted in cases of fraudulent sign-up, policy violation, rights infringement, or planet merger/closure.',
            'Titles and badges are honorary records and do not represent property rights, management rights, voting shares, or any right in relation to the artist.',
          ] }],
        },
        {
          n: 'Article 6', title: 'Prohibited Conduct',
          blocks: [
            { kind: 'ul', items: [
              "Unauthorized use of another person's email or information",
              'Self-referral, multiple accounts, macros, bots, or other automated tools',
              'Selling referral codes, conducting compensated trades, or distributing spam',
              'Creating the false impression of an official partnership with an artist or agency',
              "Infringing another person's copyright, trademark, or name/likeness rights",
              "Interfering with the Service's security or normal operation",
            ] },
            { kind: 'p', text: 'The Company may cancel a violating application and void the associated POP, referral record, PASSPORT entries, and titles.' },
          ],
        },
        {
          n: 'Article 7', title: 'Service Changes, Launch, and Suspension',
          blocks: [
            { kind: 'p', text: 'The Company may change the launch schedule, features, naming, design, POP policy, or campaign structure based on development, review, legal requirements, third-party platform policy, rights considerations, or operational needs. Material changes will be announced via the website or the registered email address.' },
            { kind: 'p', text: 'The Service may be temporarily suspended in cases reasonably beyond the Company\'s control, such as natural disasters, outages, hacking, or third-party service disruptions.' },
          ],
        },
        {
          n: 'Article 8', title: 'Intellectual Property and Disclaimer of Official Relationship',
          blocks: [
            { kind: 'p', text: 'Rights to the FANUZU name, logo, screens, and originally created planets and content belong to the Company.' },
            { kind: 'p', text: "Artist names entered by users are processed as identifying information to gauge demand for a fandom planet. Unless expressly stated otherwise, FANUZU has no partnership, sponsorship, or approval relationship with the named artist, their agency, broadcaster, or official fan club." },
            { kind: 'p', text: "Users must not upload or provide to the Company any other person's photos, logos, album artwork, videos, fan art, or similar content without authorization." },
          ],
        },
        {
          n: 'Article 9', title: 'Limitation of Liability',
          blocks: [{ kind: 'p', text: 'Absent intent or gross negligence, the Company is not liable for damages arising from a user\'s incorrect information, email delivery settings, mistyped referral codes, or third-party service failures. This does not exclude liability that cannot be excluded under applicable law.' }],
        },
        {
          n: 'Article 10', title: 'Governing Law and Dispute Resolution',
          blocks: [{ kind: 'p', text: 'These Terms are governed by the laws of the Republic of Korea. In the event of a dispute, the Company and the user will negotiate in good faith; unresolved disputes will be settled in the court of competent jurisdiction under applicable law.' }],
        },
      ],
      contactLine: 'Contact: help@fanuzu.co.kr',
      backLink: '← Back to FANUZU',
    },
    privacy: {
      eyebrow: 'PRIVACY POLICY',
      title: 'Privacy Policy',
      effective: EFFECTIVE_EN,
      infoBoxLabel: 'Key Notice',
      infoBoxText: "This Policy governs how the FANUZU pre-registration page processes your email, artist of interest, fandom name, fan-since year, language, and referral code. It will be revised into a separate, integrated privacy policy once the full app's account, community, step-tracking, advertising, and payment features launch.",
      tocLabel: 'Contents',
      toc: [
        '1. Personal Data Processed and Purposes', '2. Retention Period', '3. Processing Delegation and Cross-Border Transfer', '4. User Rights',
        '5. Restriction on Use by Minors Under 14', '6. Security Measures', '7. Cookies and Access Information', '8. Contact and Remedies', '9. Notice of Changes',
      ],
      articles: [
        {
          n: '1', title: 'Personal Data Processed and Purposes',
          blocks: [
            { kind: 'table', head: ['Category', 'Items', 'Purpose'], rows: [
              ['Required', 'Email, artist of interest, service language, whether required consents (Terms/Privacy) were given and when', 'Accepting pre-registration, launch notifications, identifying applicants, preventing duplicate applications, handling inquiries'],
              ['Optional', 'Fandom name, fan-since year, referral code, marketing consent status', 'Gauging demand for fandom planet creation, confirming referral relationships, reserving pre-registration POP rewards, sending news and promotions'],
              ['Automatically generated', 'Access timestamps, IP address, browser/device information, language setting, usage records, error logs', 'Security, detecting fraud and duplicate applications, incident response, service quality improvement'],
              ['Pre-registration results', 'Pre-registration order number, per-artist join order, generated referral code, POP reward reservation status, ORIGIN 100 candidacy', 'Providing pre-registration results, account linking and benefit verification after full launch'],
            ] },
            { kind: 'p', text: 'A referral code and marketing consent are both optional — you may pre-register without either. The Company does not collect national ID numbers, payment information, or precise location data at the pre-registration stage.' },
          ],
        },
        {
          n: '2', title: 'Retention Period',
          blocks: [
            { kind: 'ul', items: [
              'Pre-registration data: destroyed within 30 days of the date launch notifications are sent and benefits are linked.',
              'Data linked to a full-app account: transferred to the app account with separate user consent, thereafter governed by the full-app privacy policy.',
              'Upon withdrawal of consent or a deletion request: destroyed without delay unless retention is legally required.',
              'Records related to fraud or dispute handling: may be retained for the minimum period necessary until the related matter is resolved.',
              'Where other laws specify a different retention period: retained for that legally required period.',
            ] },
            { kind: 'p', text: 'Once the retention purpose is fulfilled, electronic files are deleted using methods that make recovery infeasible.' },
          ],
        },
        {
          n: '3', title: 'Processing Delegation and Cross-Border Transfer',
          blocks: [
            { kind: 'p', text: 'The Company uses the following providers to operate a stable web service. This Policy will be updated if the providers used or the location of processing changes.' },
            { kind: 'table', head: ['Recipient', 'Function', 'Transfer country / timing / method', 'Retention period'], rows: [
              ['Vercel Inc.', 'Web hosting, deployment, request handling, security and error logs', "United States and countries where Vercel's subprocessors operate / encrypted network transfer on each site visit or form submission", 'For the duration of the service agreement or until the purpose is fulfilled'],
              ['Supabase Inc.', 'Database, storage of pre-registration data, security operations', 'Project data is primarily hosted in the Seoul region; it may be processed to a limited extent in the United States or other subprocessor countries for operations/support / encrypted transfer on form submission', 'For the pre-registration data retention period or until the contract ends'],
            ] },
            { kind: 'p', text: 'You may decline the cross-border transfer, though this may limit your ability to submit a pre-registration. Questions about cross-border transfer, or a request to withdraw consent, can be sent to help@fanuzu.co.kr.' },
            { kind: 'p', text: 'No separate email delivery vendor has been finalized yet (TODO). Once one is adopted, its name, transfer country, processing purpose, and retention period will be disclosed in advance.' },
          ],
        },
        {
          n: '4', title: 'User Rights and How to Exercise Them',
          blocks: [
            { kind: 'p', text: 'You may request access, correction, deletion, restriction of processing, or withdrawal of consent (including withdrawing marketing consent) regarding your personal data. Send requests to help@fanuzu.co.kr; they will be processed after identity verification.' },
            { kind: 'p', text: "Referral code application, POP reward reservations, and ORIGIN 100 candidate order are separate from personal-data correction and may be adjusted according to operating policy and fraud-review outcomes." },
          ],
        },
        {
          n: '5', title: 'Restriction on Use by Minors Under 14',
          blocks: [{ kind: 'p', text: 'FANUZU pre-registration is available only to those aged 14 or older. If the Company confirms an application was made by someone under 14, that application and related information will be deleted without delay. The full service will additionally review parental/guardian consent procedures based on each country\'s applicable age-of-consent threshold.' }],
        },
        {
          n: '6', title: 'Security Measures',
          blocks: [{ kind: 'ul', items: [
            'Encryption in transit (HTTPS)',
            'Minimized administrative privileges and access control',
            'Separation of secret keys and admin keys from source code',
            'Logging and fraud/duplicate-signup detection, IP-based request rate limiting',
            'Regular vulnerability review and minimal data collection',
          ] }],
        },
        {
          n: '7', title: 'Cookies and Similar Technologies',
          blocks: [{ kind: 'p', text: 'The website uses browser local storage for essential functions such as remembering your language selection. It does not currently use any non-essential cookies for analytics or advertising. If such tools are introduced in the future, a consent banner and opt-out method will be added to this Policy.' }],
        },
        {
          n: '8', title: 'Contact and Remedies for Rights Infringement',
          blocks: [
            { kind: 'p', text: 'Fancake Inc. / CEO Syvia Hong / Business Registration No. 2748603844' },
            { kind: 'p', text: '117, Bundangnaegok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea' },
            { kind: 'p', text: 'Contact: help@fanuzu.co.kr / Data Protection Officer: Jimin Lee' },
            { kind: 'p', text: 'If you need help with a privacy infringement, you may contact the Korea Privacy Infringement Report Center (dial 118, no area code) or the Personal Information Dispute Mediation Committee, among other relevant authorities.' },
          ],
        },
        {
          n: '9', title: 'Notice of Changes',
          blocks: [{ kind: 'p', text: 'If this Policy changes, notice will be given via the website at least 7 days before the effective date. Changes materially affecting user rights will be announced separately with a reasonable notice period.' }],
        },
      ],
      contactLine: 'Contact: help@fanuzu.co.kr',
      backLink: '← Back to FANUZU',
    },
  },

  ja: {
    terms: {
      eyebrow: 'TERMS OF SERVICE',
      title: 'FANUZU事前登録サービス利用規約',
      effective: EFFECTIVE_JA,
      infoBoxLabel: '重要',
      infoBoxText: 'この規約は、FANUZU正式アプリのリリース前におけるウェブサイト体験、ファンダム惑星の生成申請、事前登録、紹介コード、POP報酬の予約、FANUZU PASSPORTおよびORIGIN 100候補の運用に適用されます。',
      tocLabel: '目次',
      toc: [
        '1. 目的と用語', '2. 事前登録及び利用資格', '3. ファンダム惑星の申請', '4. 紹介コードとPOP',
        '5. PASSPORTと称号', '6. 禁止行為', '7. サービスの変更及び中断', '8. 知的財産権とアーティストとの関係',
        '9. 責任の制限', '10. 準拠法及び紛争',
      ],
      articles: [
        {
          n: '第1条', title: '目的及び用語',
          blocks: [
            { kind: 'p', text: 'この規約は、Fancake Inc.（以下「当社」）が提供するFANUZU事前登録ウェブサイト及び関連機能の利用条件を定めます。' },
            { kind: 'defs', items: [
              { term: 'POP', text: 'ファンの時間と行動を記録するFANUZUの非現金型貢献ポイントです。' },
              { term: 'ファンダム惑星', text: '特定のアーティストを応援するファンの貢献と活動を可視化したFANUZU内の共同空間です。' },
              { term: 'FANUZU PASSPORT', text: '利用者の参加、貢献、キャンペーン、成長段階、称号などを表示するデジタルファンID及び活動記録です。' },
              { term: 'PLANET FOUNDER', text: 'ファンダム惑星の生成を最初に有効に提案した利用者に付与できる限定的な役割です。' },
              { term: 'ORIGIN 100', text: '各ファンダム惑星に有効に参加した最初の100名に、検証後付与できる創立称号です。' },
              { term: '紹介コード', text: '事前登録利用者をつなぎ、報酬条件を確認するための固有のコードです。' },
            ] },
          ],
        },
        {
          n: '第2条', title: '事前登録及び利用資格',
          blocks: [{ kind: 'ul', items: [
            '事前登録は満14歳以上のみ申請できます。',
            '利用者は本人が使用する有効なメールアドレスと正確な情報を入力する必要があります。',
            'メール認証、正式リリース後の初回ログインまたはアカウント連携が完了した後に、POPの支給及び限定称号が最終的に確定します。',
            '事前登録自体は、正式サービスアカウントの作成、特定の特典の無条件付与、サービスのリリース日または特定機能の提供を保証しません。',
          ] }],
        },
        {
          n: '第3条', title: 'ファンダム惑星の生成申請',
          blocks: [{ kind: 'ul', items: [
            '利用者は関心のあるアーティスト名を入力して新規ファンダム惑星の生成を申請するか、既存の申請に参加できます。',
            '同一アーティストが異なる名称・表記・活動名で重複申請された場合、当社は検討の上、統合、修正または分離できます。',
            'ファンダム惑星は、申請者数、権利侵害の可能性、運営可能性、サービス方針などを検討して生成されます。',
            'PLANET FOUNDERの表示は、最初の入力時刻のみでなく、重複・虚偽・権利侵害・自動化申請の有無などを検証した上で確定します。',
            'アーティスト、所属事務所または公式ファンクラブの要請、または権利侵害の懸念がある場合、惑星名、表示方法または運営状態が変更されることがあります。',
          ] }],
        },
        {
          n: '第4条', title: '紹介コード及びPOP報酬',
          blocks: [
            { kind: 'ul', items: [
              '紹介コードは任意であり、紹介コードなしでも事前登録できます。',
              '紹介コードなしで有効に事前登録すると、新規利用者に50 POPが予約されます。',
              '有効な紹介コードを入力して事前登録すると、新規利用者と紹介者にそれぞれ100 POPが予約されます。',
              'POPは、メール認証及び正式リリース後の初回ログインまたはアカウント連携が完了した後に支給できます。',
              '一つの申請には一つの紹介コードのみ適用され、登録完了後は原則として変更できません。',
              '自己紹介、同一人物による複数アカウント、虚偽のメールアドレス、自動化登録、コードの取引、報酬のみを目的とした不正登録は無効として処理されます。',
              '紹介数はORIGIN 100の順番を早めるものではありません。',
              'POPは現金、電子マネー、預金、有価証券ではなく、現金への換金や利用者間の販売・譲渡はできません。',
              '事前登録POPの使用先、有効期間、消化方法は正式リリースの方針で具体化され、利用者に不利益となる重大な変更は事前に案内します。',
            ] },
            { kind: 'p', text: '詳細な基準は事前登録・紹介・POP運営方針でご確認いただけます。' },
          ],
        },
        {
          n: '第5条', title: 'FANUZU PASSPORT、PLANET FOUNDER及びORIGIN 100',
          blocks: [{ kind: 'ul', items: [
            'ウェブサイトに表示されるPASSPORTは、正式サービスの予定機能を説明するためのプレビューである場合があります。',
            'パスポートの累積貢献、キャンペーン、成長段階、バッジは、当社が検証した活動記録に基づいて表示されます。',
            'ORIGIN 100は、決済金額や紹介数ではなく、各ファンダム惑星に有効に事前登録し必要な認証を完了した順序を基準とします。',
            '表示される順番は、サーバー記録、重複統合、不正利用の検証、アーティスト名の統合により、仮の順番と異なる場合があります。',
            '不正登録、サービス方針違反、権利侵害、または惑星の統合・閉鎖の事由がある場合、候補資格または称号が取消・調整されることがあります。',
            '称号及びバッジは名誉的な記録であり、財産権、経営権、投票権、またはアーティストに対する権利を意味しません。',
          ] }],
        },
        {
          n: '第6条', title: '禁止行為',
          blocks: [
            { kind: 'ul', items: [
              '他人のメールアドレスまたは情報の無断使用',
              '自己紹介、複数アカウント、マクロ、ボット、自動化ツールの使用',
              '紹介コードの販売、対価を伴う取引、スパムの配布',
              'アーティスト・所属事務所と公式に提携しているかのように誤認させる行為',
              '他人の著作権、商標権、氏名・肖像に関する権利の侵害',
              'サービスの安全性または正常な運営を妨害する行為',
            ] },
            { kind: 'p', text: '当社は違反した申請を取消し、関連するPOP、紹介実績、PASSPORT記録及び称号を無効化することができます。' },
          ],
        },
        {
          n: '第7条', title: 'サービスの変更、リリース及び中断',
          blocks: [
            { kind: 'p', text: '当社は、開発、審査、法令、第三者プラットフォームの方針、権利関係または運営上の必要に応じて、リリース日程、機能、名称、デザイン、POP方針、キャンペーン構造を変更できます。重要な変更はウェブサイトまたは登録されたメールアドレスを通じて案内します。' },
            { kind: 'p', text: '天災、障害、不正アクセス、第三者サービスの中断など、合理的に制御が困難な事由がある場合、サービスが一時的に中断されることがあります。' },
          ],
        },
        {
          n: '第8条', title: '知的財産権及び公式関係の否認',
          blocks: [
            { kind: 'p', text: 'FANUZUの名称、ロゴ、画面、自社制作の惑星及びコンテンツに関する権利は当社に帰属します。' },
            { kind: 'p', text: '利用者が入力したアーティスト名は、ファンダム惑星の需要確認のための識別情報として処理されます。別途明示しない限り、FANUZUは当該アーティスト、所属事務所、放送局または公式ファンクラブと提携・後援・承認の関係にはありません。' },
            { kind: 'p', text: '利用者は、他人の写真、ロゴ、アルバム画像、映像、ファンアートなどを権限なくアップロードまたは当社に提供してはなりません。' },
          ],
        },
        {
          n: '第9条', title: '責任の制限',
          blocks: [{ kind: 'p', text: '当社は、故意または重大な過失がない限り、利用者の誤った情報入力、メール受信設定、紹介コードの誤入力、第三者サービスの障害により生じた損害について責任を負いません。ただし、関係法令上排除できない責任は除外しません。' }],
        },
        {
          n: '第10条', title: '準拠法及び紛争解決',
          blocks: [{ kind: 'p', text: 'この規約は大韓民国の法律に従います。紛争が発生した場合、当社と利用者は誠実に協議し、解決しない場合は関係法令に従う管轄裁判所で解決します。' }],
        },
      ],
      contactLine: 'お問い合わせ: help@fanuzu.co.kr',
      backLink: '← FANUZUに戻る',
    },
    privacy: {
      eyebrow: 'PRIVACY POLICY',
      title: '個人情報保護方針',
      effective: EFFECTIVE_JA,
      infoBoxLabel: '重要なご案内',
      infoBoxText: 'この方針は、FANUZU事前登録ページにおいて、メールアドレス、関心アーティスト、ファンダム名、ファン歴、言語、紹介コードなどを処理する基準です。正式アプリで会員登録・コミュニティ・ウォーキング・広告・決済機能が開始される際は、別途統合された個人情報保護方針に改定されます。',
      tocLabel: '目次',
      toc: [
        '1. 処理する個人情報と目的', '2. 保有及び利用期間', '3. 処理委託及び国外移転', '4. 利用者の権利',
        '5. 満14歳未満の利用制限', '6. 安全性確保措置', '7. クッキー及び接続情報', '8. 担当者及び権利侵害の救済', '9. 方針の変更',
      ],
      articles: [
        {
          n: '1', title: '処理する個人情報と目的',
          blocks: [
            { kind: 'table', head: ['区分', '項目', '目的'], rows: [
              ['必須', 'メールアドレス、関心アーティスト名、利用言語、必須同意（利用規約・個人情報）の有無及び同意日時', '事前登録の受付、リリース案内、申請者の識別、重複申請の防止、問い合わせ対応'],
              ['任意', 'ファンダム名、ファン歴、紹介コード、マーケティング受信同意の有無', 'ファンダム惑星生成需要の集計、紹介関係の確認、事前登録POP報酬の予約、お知らせ・プロモーションの配信'],
              ['自動生成', 'アクセス日時、IPアドレス、ブラウザ・機器情報、言語設定、サービス利用記録、エラーログ', 'セキュリティ、不正・重複申請の検知、障害対応、サービス品質の向上'],
              ['事前登録結果', '事前登録順番、アーティスト別参加順番、生成された紹介コード、POP報酬予約状況、ORIGIN 100候補の有無', '事前登録結果の提供、正式リリース後のアカウント連携及び特典の検証'],
            ] },
            { kind: 'p', text: '紹介コード及びマーケティング受信同意は任意であり、同意しなくても事前登録できます。当社は、住民登録番号、決済情報、精密な位置情報を事前登録の段階で収集しません。' },
          ],
        },
        {
          n: '2', title: '保有及び利用期間',
          blocks: [
            { kind: 'ul', items: [
              '事前登録情報：正式リリースの案内発送及び特典連携が完了した日から30日以内に破棄します。',
              '正式アプリのアカウントに連携した情報：利用者の別途の同意を得てアプリアカウント情報に移転し、以後は正式アプリの個人情報保護方針に従います。',
              '同意撤回または削除要請時：法令上の保管義務がない限り、遅滞なく破棄します。',
              '不正利用及び紛争対応記録：必要最小限の範囲で、関連する紛争が終了するまで保管することがあります。',
              '関係法令が別途保存期間を定める場合：当該法令が定める期間保管します。',
            ] },
            { kind: 'p', text: '保有目的が達成された場合、電子ファイルは復元が困難な方法で削除します。' },
          ],
        },
        {
          n: '3', title: '個人情報の処理委託及び国外移転',
          blocks: [
            { kind: 'p', text: '当社は、安定したウェブサービス運営のため、以下の事業者を利用しています。実際に適用される事業者や処理場所が変更される場合、この方針を更新します。' },
            { kind: 'table', head: ['受託者', '業務', '移転国・時点・方法', '保有期間'], rows: [
              ['Vercel Inc.', 'ウェブホスティング、配信、リクエスト処理、セキュリティ及びエラーログ', 'アメリカ及びVercelの下請け処理業者の運営国 / ウェブサイトアクセス及びフォーム送信時の暗号化されたネットワーク伝送', 'サービス提供契約期間または目的達成時まで'],
              ['Supabase Inc.', 'データベース、事前登録情報の保存、セキュリティ運営', 'プロジェクトデータはソウルリージョンの利用を原則とし、運営・サポート過程でアメリカ等の下請け処理業者の運営国で限定的に処理される場合があります / フォーム送信時の暗号化伝送', '事前登録情報の保有期間または契約終了時まで'],
            ] },
            { kind: 'p', text: '利用者は国外移転に同意しないことができますが、その場合、事前登録の提出が制限されることがあります。国外移転に関するお問い合わせまたは同意の撤回は help@fanuzu.co.kr までご連絡ください。' },
            { kind: 'p', text: '現在、別途のメール配信業者は確定していません（TODO）。導入時は事業者名、移転国、処理目的及び保有期間を事前に公開します。' },
          ],
        },
        {
          n: '4', title: '利用者の権利及び行使方法',
          blocks: [
            { kind: 'p', text: '利用者は自身の個人情報について、閲覧、訂正、削除、処理停止、同意の撤回（マーケティング受信の撤回を含む）を要請できます。要請は help@fanuzu.co.kr へ送付いただければ、本人確認後に処理します。' },
            { kind: 'p', text: '紹介コードの適用、POP報酬の予約、ORIGIN 100候補順番は、個人情報の訂正とは別に、運営方針及び不正利用の検証結果により調整されることがあります。' },
          ],
        },
        {
          n: '5', title: '満14歳未満の利用制限',
          blocks: [{ kind: 'p', text: 'FANUZUの事前登録は満14歳以上のみご利用いただけます。当社が満14歳未満による申請であることを確認した場合、当該申請及び関連情報を遅滞なく削除します。正式サービスでは、国別の同意年齢基準に応じて法定代理人の同意手続きを別途検討します。' }],
        },
        {
          n: '6', title: '安全性確保措置',
          blocks: [{ kind: 'ul', items: [
            '通信区間の暗号化（HTTPS）',
            '管理権限の最小化及びアクセス制御',
            '秘密鍵と管理者鍵のソースコードからの分離',
            'ログ及び不正登録の検知、IPベースのリクエスト頻度制限',
            '定期的な脆弱性点検とデータの最小収集',
          ] }],
        },
        {
          n: '7', title: 'クッキー及び類似技術',
          blocks: [{ kind: 'p', text: '本ウェブサイトは、言語選択の保存など必須機能のためにブラウザのローカルストレージを使用します。現在、分析・広告等の非必須クッキーは使用していません。今後導入する場合は、同意バナー及び拒否方法をこの方針に追加します。' }],
        },
        {
          n: '8', title: '個人情報保護担当者及び権利侵害の救済',
          blocks: [
            { kind: 'p', text: 'Fancake Inc. / 代表者 Syvia Hong / 事業者登録番号 2748603844' },
            { kind: 'p', text: '117, Bundangnaegok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea' },
            { kind: 'p', text: 'お問い合わせ: help@fanuzu.co.kr / 個人情報保護担当者: イ・ジミン' },
            { kind: 'p', text: '個人情報侵害の相談が必要な場合は、個人情報侵害申告センター（局番なしの118）、個人情報紛争調停委員会等の関係機関にご相談いただけます。' },
          ],
        },
        {
          n: '9', title: '方針の変更',
          blocks: [{ kind: 'p', text: 'この方針の内容が変更される場合、施行日の最低7日前にウェブサイトを通じて案内します。利用者の権利に重大な影響を与える変更は、合理的な期間を設けて別途案内します。' }],
        },
      ],
      contactLine: 'お問い合わせ: help@fanuzu.co.kr',
      backLink: '← FANUZUに戻る',
    },
  },

  es: {
    terms: {
      eyebrow: 'TERMS OF SERVICE',
      title: 'Términos de Servicio de Preinscripción de FANUZU',
      effective: EFFECTIVE_ES,
      infoBoxLabel: 'Importante',
      infoBoxText: 'Estos Términos se aplican a la experiencia del sitio web de FANUZU, las solicitudes de creación de planetas del fandom, la preinscripción, los códigos de referido, las recompensas de POP reservadas, y la candidatura de FANUZU PASSPORT y ORIGIN 100 que se muestran antes del lanzamiento de la app completa.',
      tocLabel: 'Índice',
      toc: [
        '1. Objeto y definiciones', '2. Preinscripción y elegibilidad', '3. Solicitudes de planeta del fandom', '4. Códigos de referido y POP',
        '5. PASSPORT y títulos', '6. Conductas prohibidas', '7. Cambios y suspensión del servicio', '8. Propiedad intelectual y relación con el artista',
        '9. Limitación de responsabilidad', '10. Ley aplicable y disputas',
      ],
      articles: [
        {
          n: 'Artículo 1', title: 'Objeto y Definiciones',
          blocks: [
            { kind: 'p', text: 'Estos Términos establecen las condiciones de uso del sitio web de preinscripción de FANUZU y sus funciones relacionadas, proporcionados por Fancake Inc. ("la Compañía").' },
            { kind: 'defs', items: [
              { term: 'POP', text: 'El punto de contribución no monetario de FANUZU que registra el tiempo y las acciones de un fan.' },
              { term: 'Planeta del fandom', text: 'Un espacio compartido dentro de FANUZU que visualiza la contribución y actividad de los fans que apoyan a un artista específico.' },
              { term: 'FANUZU PASSPORT', text: 'Una identificación digital de fan y registro de actividad que muestra la participación, contribución, campañas, etapas de crecimiento y títulos de un usuario.' },
              { term: 'PLANET FOUNDER', text: 'Un rol limitado que puede otorgarse al usuario que propuso primero y de forma válida la creación de un planeta del fandom.' },
              { term: 'ORIGIN 100', text: 'Un título fundador que puede otorgarse, tras verificación, a los primeros 100 usuarios que participaron válidamente en un planeta del fandom determinado.' },
              { term: 'Código de referido', text: 'Un código único usado para conectar usuarios preinscritos y determinar la elegibilidad de recompensas.' },
            ] },
          ],
        },
        {
          n: 'Artículo 2', title: 'Preinscripción y Elegibilidad',
          blocks: [{ kind: 'ul', items: [
            'La preinscripción está abierta solo para personas de 14 años o más.',
            'Los usuarios deben proporcionar una dirección de correo electrónico válida que controlen e información precisa.',
            'El pago de POP y cualquier título limitado solo se confirman tras la verificación del correo y el primer inicio de sesión o vinculación de cuenta una vez lanzado el servicio completo.',
            'La preinscripción en sí no garantiza la creación de una cuenta de servicio completo, la entrega incondicional de ningún beneficio, una fecha de lanzamiento ni ninguna función específica.',
          ] }],
        },
        {
          n: 'Artículo 3', title: 'Solicitudes de Creación de Planeta del Fandom',
          blocks: [{ kind: 'ul', items: [
            'Los usuarios pueden solicitar la creación de un nuevo planeta del fandom ingresando el nombre de un artista, o unirse a una solicitud existente.',
            'Si el mismo artista es solicitado bajo diferentes nombres, grafías o nombres artísticos, la Compañía puede revisar y fusionar, corregir o dividir esas solicitudes.',
            'Un planeta del fandom se crea tras revisar factores como el número de solicitantes, el posible riesgo de infracción de derechos, la viabilidad operativa y la política del servicio.',
            'La designación de PLANET FOUNDER se confirma solo después de verificar solicitudes duplicadas, falsas, infractoras de derechos o automatizadas, no únicamente por el momento de envío más temprano.',
            'El nombre, la presentación o el estado operativo de un planeta pueden cambiar a solicitud del artista, su agencia o un club de fans oficial, o cuando exista preocupación por infracción de derechos.',
          ] }],
        },
        {
          n: 'Artículo 4', title: 'Códigos de Referido y Recompensas de POP',
          blocks: [
            { kind: 'ul', items: [
              'El código de referido es opcional; se puede preinscribir sin uno.',
              'La preinscripción válida sin código de referido reserva 50 POP para el nuevo usuario.',
              'La preinscripción válida con un código de referido válido reserva 100 POP tanto para el nuevo usuario como para quien lo refirió.',
              'El POP solo puede pagarse tras la verificación del correo y el primer inicio de sesión o vinculación de cuenta una vez lanzado el servicio completo.',
              'Solo se puede aplicar un código de referido por solicitud, y generalmente no puede cambiarse después de completar el registro.',
              'La autorreferencia, múltiples cuentas de la misma persona, correos falsos, registros automatizados, el comercio de códigos y los registros hechos únicamente para obtener recompensas se consideran inválidos.',
              'El número de referidos no adelanta el orden de ORIGIN 100 de un usuario.',
              'El POP no es efectivo, dinero electrónico, un depósito ni un valor, y no puede cambiarse por efectivo ni venderse/transferirse entre usuarios.',
              'Dónde puede usarse el POP, su período de validez y su forma de consumo se detallarán en la política del servicio completo; los cambios materiales desfavorables para los usuarios se anunciarán con antelación.',
            ] },
            { kind: 'p', text: 'Los criterios detallados están disponibles en la Política de Operación de Preinscripción, Referidos y POP.' },
          ],
        },
        {
          n: 'Artículo 5', title: 'FANUZU PASSPORT, PLANET FOUNDER y ORIGIN 100',
          blocks: [{ kind: 'ul', items: [
            'El PASSPORT mostrado en el sitio web puede ser una vista previa que ilustra una función planificada del servicio completo.',
            'La contribución acumulada, las campañas, la etapa de crecimiento y las insignias de un pasaporte se muestran según los registros de actividad verificados por la Compañía.',
            'ORIGIN 100 se basa en el orden en que un usuario se preinscribió válidamente y completó la verificación requerida para un planeta del fandom determinado, no en el monto pagado ni el número de referidos.',
            'Los números de orden mostrados pueden diferir de los números provisionales debido a registros del servidor, fusiones de duplicados, verificación de fraude o consolidación de nombres de artistas.',
            'La candidatura o un título pueden revocarse o ajustarse en casos de registro fraudulento, incumplimiento de la política, infracción de derechos, o fusión/cierre del planeta.',
            'Los títulos e insignias son registros honoríficos y no representan derechos de propiedad, derechos de gestión, participación en votaciones ni ningún derecho relacionado con el artista.',
          ] }],
        },
        {
          n: 'Artículo 6', title: 'Conductas Prohibidas',
          blocks: [
            { kind: 'ul', items: [
              'Uso no autorizado del correo electrónico o la información de otra persona',
              'Autorreferencia, múltiples cuentas, macros, bots u otras herramientas automatizadas',
              'Venta de códigos de referido, transacciones a cambio de compensación o distribución de spam',
              'Crear la falsa impresión de una asociación oficial con un artista o agencia',
              'Infringir los derechos de autor, marca registrada o nombre/imagen de otra persona',
              'Interferir con la seguridad o el funcionamiento normal del Servicio',
            ] },
            { kind: 'p', text: 'La Compañía puede cancelar una solicitud infractora e invalidar el POP, el registro de referidos, las entradas de PASSPORT y los títulos asociados.' },
          ],
        },
        {
          n: 'Artículo 7', title: 'Cambios, Lanzamiento y Suspensión del Servicio',
          blocks: [
            { kind: 'p', text: 'La Compañía puede cambiar el cronograma de lanzamiento, las funciones, el nombre, el diseño, la política de POP o la estructura de campañas según el desarrollo, la revisión, requisitos legales, la política de plataformas de terceros, consideraciones de derechos o necesidades operativas. Los cambios importantes se anunciarán a través del sitio web o la dirección de correo registrada.' },
            { kind: 'p', text: 'El Servicio puede suspenderse temporalmente en casos razonablemente fuera del control de la Compañía, como desastres naturales, fallas, hackeos o interrupciones de servicios de terceros.' },
          ],
        },
        {
          n: 'Artículo 8', title: 'Propiedad Intelectual y Renuncia de Relación Oficial',
          blocks: [
            { kind: 'p', text: 'Los derechos sobre el nombre, logotipo, pantallas de FANUZU, y los planetas y contenido creados originalmente pertenecen a la Compañía.' },
            { kind: 'p', text: 'Los nombres de artistas ingresados por los usuarios se procesan como información identificativa para evaluar la demanda de un planeta del fandom. A menos que se indique expresamente lo contrario, FANUZU no tiene ninguna relación de asociación, patrocinio o aprobación con el artista mencionado, su agencia, cadena de difusión o club de fans oficial.' },
            { kind: 'p', text: 'Los usuarios no deben subir ni proporcionar a la Compañía fotos, logotipos, imágenes de álbumes, videos, fan art u otro contenido de terceros sin autorización.' },
          ],
        },
        {
          n: 'Artículo 9', title: 'Limitación de Responsabilidad',
          blocks: [{ kind: 'p', text: 'Salvo dolo o negligencia grave, la Compañía no es responsable por los daños derivados de información incorrecta del usuario, configuración de recepción de correo, códigos de referido mal escritos, o fallas de servicios de terceros. Esto no excluye la responsabilidad que no pueda excluirse conforme a la ley aplicable.' }],
        },
        {
          n: 'Artículo 10', title: 'Ley Aplicable y Resolución de Disputas',
          blocks: [{ kind: 'p', text: 'Estos Términos se rigen por las leyes de la República de Corea. En caso de disputa, la Compañía y el usuario negociarán de buena fe; las disputas no resueltas se resolverán en el tribunal de jurisdicción competente conforme a la ley aplicable.' }],
        },
      ],
      contactLine: 'Contacto: help@fanuzu.co.kr',
      backLink: '← Volver a FANUZU',
    },
    privacy: {
      eyebrow: 'PRIVACY POLICY',
      title: 'Política de Privacidad',
      effective: EFFECTIVE_ES,
      infoBoxLabel: 'Aviso Clave',
      infoBoxText: 'Esta Política rige cómo la página de preinscripción de FANUZU procesa tu correo electrónico, artista de interés, nombre del fandom, año desde que eres fan, idioma y código de referido. Se revisará como una política de privacidad integrada y separada una vez que se lancen las funciones de cuenta, comunidad, seguimiento de pasos, publicidad y pago de la app completa.',
      tocLabel: 'Índice',
      toc: [
        '1. Datos personales procesados y finalidades', '2. Período de conservación', '3. Delegación del procesamiento y transferencia internacional', '4. Derechos del usuario',
        '5. Restricción de uso por menores de 14 años', '6. Medidas de seguridad', '7. Cookies e información de acceso', '8. Contacto y remedios', '9. Aviso de cambios',
      ],
      articles: [
        {
          n: '1', title: 'Datos Personales Procesados y Finalidades',
          blocks: [
            { kind: 'table', head: ['Categoría', 'Elementos', 'Finalidad'], rows: [
              ['Obligatorio', 'Correo electrónico, artista de interés, idioma del servicio, si se otorgaron los consentimientos obligatorios (Términos/Privacidad) y cuándo', 'Aceptar la preinscripción, notificaciones de lanzamiento, identificar solicitantes, evitar solicitudes duplicadas, atender consultas'],
              ['Opcional', 'Nombre del fandom, año desde que eres fan, código de referido, estado del consentimiento de marketing', 'Medir la demanda de creación del planeta del fandom, confirmar relaciones de referido, reservar recompensas de POP de preinscripción, enviar noticias y promociones'],
              ['Generado automáticamente', 'Marcas de tiempo de acceso, dirección IP, información del navegador/dispositivo, configuración de idioma, registros de uso, registros de errores', 'Seguridad, detección de fraude y solicitudes duplicadas, respuesta a incidentes, mejora de la calidad del servicio'],
              ['Resultados de preinscripción', 'Número de orden de preinscripción, orden de ingreso por artista, código de referido generado, estado de reserva de recompensa POP, candidatura a ORIGIN 100', 'Proporcionar los resultados de la preinscripción, vinculación de cuenta y verificación de beneficios tras el lanzamiento completo'],
            ] },
            { kind: 'p', text: 'El código de referido y el consentimiento de marketing son opcionales: puedes preinscribirte sin ninguno de los dos. La Compañía no recopila números de identificación nacional, información de pago ni datos de ubicación precisa en la etapa de preinscripción.' },
          ],
        },
        {
          n: '2', title: 'Período de Conservación',
          blocks: [
            { kind: 'ul', items: [
              'Datos de preinscripción: se destruyen dentro de los 30 días posteriores a la fecha en que se envían las notificaciones de lanzamiento y se vinculan los beneficios.',
              'Datos vinculados a una cuenta de la app completa: se transfieren a la cuenta de la app con el consentimiento separado del usuario; a partir de entonces se rigen por la política de privacidad de la app completa.',
              'Ante la retirada del consentimiento o una solicitud de eliminación: se destruyen sin demora, salvo que la retención sea legalmente obligatoria.',
              'Registros relacionados con fraude o resolución de disputas: pueden conservarse por el período mínimo necesario hasta que se resuelva el asunto relacionado.',
              'Cuando otras leyes especifiquen un período de retención diferente: se conservan durante ese período legalmente exigido.',
            ] },
            { kind: 'p', text: 'Una vez cumplido el propósito de conservación, los archivos electrónicos se eliminan mediante métodos que hacen la recuperación inviable.' },
          ],
        },
        {
          n: '3', title: 'Delegación del Procesamiento y Transferencia Internacional',
          blocks: [
            { kind: 'p', text: 'La Compañía utiliza los siguientes proveedores para operar un servicio web estable. Esta Política se actualizará si cambian los proveedores utilizados o la ubicación del procesamiento.' },
            { kind: 'table', head: ['Destinatario', 'Función', 'País/momento/método de transferencia', 'Período de conservación'], rows: [
              ['Vercel Inc.', 'Hospedaje web, despliegue, manejo de solicitudes, seguridad y registros de errores', 'Estados Unidos y países donde operan los subencargados de Vercel / transferencia de red cifrada en cada visita al sitio o envío de formulario', 'Durante la vigencia del acuerdo de servicio o hasta cumplir su propósito'],
              ['Supabase Inc.', 'Base de datos, almacenamiento de datos de preinscripción, operaciones de seguridad', 'Los datos del proyecto se alojan principalmente en la región de Seúl; pueden procesarse de forma limitada en Estados Unidos u otros países de subencargados para operaciones/soporte / transferencia cifrada al enviar el formulario', 'Durante el período de conservación de los datos de preinscripción o hasta la finalización del contrato'],
            ] },
            { kind: 'p', text: 'Puedes rechazar la transferencia internacional, aunque esto puede limitar tu capacidad de enviar una preinscripción. Las consultas sobre la transferencia internacional, o una solicitud de retirar el consentimiento, pueden enviarse a help@fanuzu.co.kr.' },
            { kind: 'p', text: 'Aún no se ha determinado un proveedor de envío de correo separado (TODO). Una vez adoptado, se divulgará con antelación su nombre, país de transferencia, finalidad del procesamiento y período de conservación.' },
          ],
        },
        {
          n: '4', title: 'Derechos del Usuario y Cómo Ejercerlos',
          blocks: [
            { kind: 'p', text: 'Puedes solicitar acceso, corrección, eliminación, restricción del procesamiento o retirada del consentimiento (incluida la retirada del consentimiento de marketing) sobre tus datos personales. Envía las solicitudes a help@fanuzu.co.kr; se procesarán tras la verificación de identidad.' },
            { kind: 'p', text: 'La aplicación de códigos de referido, las reservas de recompensas de POP y el orden de candidatura a ORIGIN 100 son independientes de la corrección de datos personales y pueden ajustarse según la política operativa y los resultados de la verificación de fraude.' },
          ],
        },
        {
          n: '5', title: 'Restricción de Uso por Menores de 14 Años',
          blocks: [{ kind: 'p', text: 'La preinscripción de FANUZU está disponible solo para personas de 14 años o más. Si la Compañía confirma que una solicitud fue realizada por alguien menor de 14 años, esa solicitud y la información relacionada se eliminarán sin demora. El servicio completo revisará adicionalmente los procedimientos de consentimiento parental/del tutor según el umbral de edad de consentimiento aplicable en cada país.' }],
        },
        {
          n: '6', title: 'Medidas de Seguridad',
          blocks: [{ kind: 'ul', items: [
            'Cifrado en tránsito (HTTPS)',
            'Minimización de privilegios administrativos y control de acceso',
            'Separación de claves secretas y claves de administrador del código fuente',
            'Registro y detección de fraude/registros duplicados, límite de frecuencia de solicitudes por IP',
            'Revisión periódica de vulnerabilidades y recopilación mínima de datos',
          ] }],
        },
        {
          n: '7', title: 'Cookies y Tecnologías Similares',
          blocks: [{ kind: 'p', text: 'El sitio web usa el almacenamiento local del navegador para funciones esenciales, como recordar tu selección de idioma. Actualmente no utiliza cookies no esenciales para análisis o publicidad. Si en el futuro se introducen dichas herramientas, se añadirá a esta Política un banner de consentimiento y un método de exclusión.' }],
        },
        {
          n: '8', title: 'Contacto y Remedios por Infracción de Derechos',
          blocks: [
            { kind: 'p', text: 'Fancake Inc. / CEO Syvia Hong / N.º de Registro Empresarial 2748603844' },
            { kind: 'p', text: '117, Bundangnaegok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, República de Corea' },
            { kind: 'p', text: 'Contacto: help@fanuzu.co.kr / Encargado de Protección de Datos: Jimin Lee' },
            { kind: 'p', text: 'Si necesitas ayuda con una infracción de privacidad, puedes contactar al Centro de Reporte de Infracciones de Privacidad de Corea (línea 118, sin código de área) o a la Comisión de Mediación de Disputas de Información Personal, entre otras autoridades pertinentes.' },
          ],
        },
        {
          n: '9', title: 'Aviso de Cambios',
          blocks: [{ kind: 'p', text: 'Si esta Política cambia, se dará aviso a través del sitio web al menos 7 días antes de la fecha de vigencia. Los cambios que afecten materialmente los derechos del usuario se anunciarán por separado con un período de aviso razonable.' }],
        },
      ],
      contactLine: 'Contacto: help@fanuzu.co.kr',
      backLink: '← Volver a FANUZU',
    },
  },

  zhHans: {
    terms: {
      eyebrow: 'TERMS OF SERVICE',
      title: 'FANUZU 预注册服务使用条款',
      effective: EFFECTIVE_ZH_HANS,
      infoBoxLabel: '重要提示',
      infoBoxText: '本条款适用于 FANUZU 正式应用上线前的网站体验、粉丝星球创建申请、预注册、推荐码、POP 奖励预留，以及 FANUZU PASSPORT 与 ORIGIN 100 候选资格的运营。',
      tocLabel: '目录',
      toc: [
        '1. 目的与定义', '2. 预注册与使用资格', '3. 粉丝星球申请', '4. 推荐码与POP',
        '5. PASSPORT与称号', '6. 禁止行为', '7. 服务变更与中断', '8. 知识产权与艺人关系',
        '9. 责任限制', '10. 适用法律与争议',
      ],
      articles: [
        {
          n: '第1条', title: '目的及定义',
          blocks: [
            { kind: 'p', text: '本条款规定了 Fancake Inc.（以下称"公司"）提供的 FANUZU 预注册网站及相关功能的使用条件。' },
            { kind: 'defs', items: [
              { term: 'POP', text: '记录粉丝时间与行动的 FANUZU 非现金贡献积分。' },
              { term: '粉丝星球', text: 'FANUZU 内将支持特定艺人的粉丝的贡献与活动可视化的共同空间。' },
              { term: 'FANUZU PASSPORT', text: '显示用户参与、贡献、活动、成长阶段、称号等信息的数字粉丝身份证明及活动记录。' },
              { term: 'PLANET FOUNDER', text: '可授予最先有效提议创建某粉丝星球的用户的限定角色。' },
              { term: 'ORIGIN 100', text: '经核实后，可授予有效参与某粉丝星球最初100名用户的创立称号。' },
              { term: '推荐码', text: '用于连接预注册用户并确认奖励资格的唯一代码。' },
            ] },
          ],
        },
        {
          n: '第2条', title: '预注册及使用资格',
          blocks: [{ kind: 'ul', items: [
            '仅限满14周岁及以上人员申请预注册。',
            '用户须填写本人使用的有效电子邮箱及准确信息。',
            '需完成邮箱验证，并在正式上线后完成首次登录或账号绑定，POP发放及限定称号才能最终确定。',
            '预注册本身并不保证创建正式服务账号、无条件获得任何权益、服务上线日期或特定功能的提供。',
          ] }],
        },
        {
          n: '第3条', title: '粉丝星球创建申请',
          blocks: [{ kind: 'ul', items: [
            '用户可输入关注的艺人姓名申请创建新的粉丝星球，或加入已有申请。',
            '若同一艺人以不同名称、拼写或艺名被重复申请，公司可审核后进行合并、修改或拆分。',
            '粉丝星球的创建将综合考虑申请人数、潜在权利侵害风险、运营可行性及服务政策等因素。',
            'PLANET FOUNDER 的认定不仅依据最早提交时间，还需核实是否存在重复、虚假、侵权或自动化申请等情形后方可确定。',
            '若艺人、所属经纪公司或官方粉丝俱乐部提出要求，或存在权利侵害风险，星球名称、展示方式或运营状态可能发生变更。',
          ] }],
        },
        {
          n: '第4条', title: '推荐码及POP奖励',
          blocks: [
            { kind: 'ul', items: [
              '推荐码为选填项，不填写推荐码也可完成预注册。',
              '未填写推荐码有效预注册的新用户将获得预留的50 POP。',
              '填写有效推荐码完成预注册后，新用户与推荐人将各获得预留的100 POP。',
              'POP 须在完成邮箱验证及正式上线后首次登录或账号绑定后方可发放。',
              '每次申请仅可使用一个推荐码，注册完成后原则上不可更改。',
              '自我推荐、同一人使用多个账号、虚假邮箱、自动化注册、买卖推荐码，以及以获取奖励为唯一目的的异常注册，均视为无效。',
              '推荐数量不会提前用户的 ORIGIN 100 顺序。',
              'POP 并非现金、电子货币、存款或有价证券，不可兑换为现金，也不可在用户之间买卖或转让。',
              '预注册 POP 的使用范围、有效期及消耗方式将在正式上线政策中具体明确；对用户不利的重大变更将提前告知。',
            ] },
            { kind: 'p', text: '详细标准可参阅《预注册·推荐·POP运营政策》。' },
          ],
        },
        {
          n: '第5条', title: 'FANUZU PASSPORT、PLANET FOUNDER 及 ORIGIN 100',
          blocks: [{ kind: 'ul', items: [
            '网站展示的 PASSPORT 可能是用于说明正式服务规划功能的预览。',
            '护照中显示的累计贡献、活动、成长阶段及徽章，均依据公司核实后的活动记录展示。',
            'ORIGIN 100 的评定并非依据付款金额或推荐数量，而是依据在各粉丝星球中有效预注册并完成所需验证的先后顺序。',
            '由于服务器记录、重复合并、不正当使用核查及艺人名称整合等原因，显示顺序可能与临时顺序不同。',
            '如存在不正当注册、违反服务政策、侵犯权利或星球合并·关闭等情形，候选资格或称号可能被取消或调整。',
            '称号及徽章为荣誉性记录，不代表财产权、经营权、投票权或对艺人本人的任何权利。',
          ] }],
        },
        {
          n: '第6条', title: '禁止行为',
          blocks: [
            { kind: 'ul', items: [
              '擅自使用他人的电子邮箱或信息',
              '自我推荐、使用多个账号、使用宏、机器人或其他自动化工具',
              '买卖推荐码、进行有偿交易或发布垂圾信息',
              '使人误以为与艺人或所属经纪公司存在官方合作关系的行为',
              '侵犯他人著作权、商标权及姓名·肖像相关权利',
              '妨害服务安全或正常运营的行为',
            ] },
            { kind: 'p', text: '公司可取消违规申请，并使相关POP、推荐记录、PASSPORT记录及称号失效。' },
          ],
        },
        {
          n: '第7条', title: '服务变更、上线及中断',
          blocks: [
            { kind: 'p', text: '公司可根据开发进度、审核、法律法规、第三方平台政策、权利关系或运营需要，变更上线时间、功能、名称、设计、POP政策及活动结构。重大变更将通过网站或注册邮箱进行告知。' },
            { kind: 'p', text: '如遇自然灾害、系统故障、黑客攻击、第三方服务中断等公司难以合理控制的事由，服务可能暂时中断。' },
          ],
        },
        {
          n: '第8条', title: '知识产权及官方关系的否认',
          blocks: [
            { kind: 'p', text: 'FANUZU 名称、标识、页面及自主制作的星球与内容相关权利归公司所有。' },
            { kind: 'p', text: '用户填写的艺人姓名将作为确认粉丝星球创建需求的识别信息进行处理。除另有明确说明外，FANUZU 与相关艺人、所属经纪公司、电视台或官方粉丝俱乐部之间不存在合作、赞助或认可关系。' },
            { kind: 'p', text: '用户不得未经授权上传或向公司提供他人的照片、标识、专辑图像、影像、粉丝创作作品等内容。' },
          ],
        },
        {
          n: '第9条', title: '责任限制',
          blocks: [{ kind: 'p', text: '除存在故意或重大过失外，公司对因用户信息填写错误、邮箱接收设置、推荐码输入错误或第三方服务故障所造成的损害不承担责任。但相关法律法规规定不可免除的责任不在此列。' }],
        },
        {
          n: '第10条', title: '适用法律及争议解决',
          blocks: [{ kind: 'p', text: '本条款适用大韩民国法律。发生争议时，公司与用户应诚实协商；协商未能解决的，依相关法律法规提交有管辖权的法院解决。' }],
        },
      ],
      contactLine: '联系方式：help@fanuzu.co.kr',
      backLink: '← 返回 FANUZU',
    },
    privacy: {
      eyebrow: 'PRIVACY POLICY',
      title: '隐私政策',
      effective: EFFECTIVE_ZH_HANS,
      infoBoxLabel: '重要提示',
      infoBoxText: '本政策规定了 FANUZU 预注册页面处理电子邮箱、关注艺人、粉丝团名称、入坑年份、语言及推荐码等信息的标准。正式应用开放会员注册、社区、步数、广告及支付功能后，将另行修订为统一的隐私政策。',
      tocLabel: '目录',
      toc: [
        '1. 处理的个人信息与目的', '2. 保留及使用期限', '3. 处理委托及跨境传输', '4. 用户权利',
        '5. 未满14周岁用户使用限制', '6. 安全保障措施', '7. Cookie及访问信息', '8. 联系方式及权益救济', '9. 政策变更',
      ],
      articles: [
        {
          n: '1', title: '处理的个人信息与目的',
          blocks: [
            { kind: 'table', head: ['类别', '项目', '目的'], rows: [
              ['必填', '电子邮箱、关注艺人姓名、使用语言、必填同意（使用条款/隐私政策）情况及同意时间', '受理预注册、发送上线通知、识别申请人、防止重复申请、处理咨询'],
              ['选填', '粉丝团名称、入坑年份、推荐码、营销信息接收同意情况', '统计粉丝星球创建需求、确认推荐关系、预留预注册POP奖励、发送消息与推广信息'],
              ['自动生成', '访问时间、IP地址、浏览器·设备信息、语言设置、服务使用记录、错误日志', '安全保障、检测不正当及重复申请、故障应对、提升服务质量'],
              ['预注册结果', '预注册顺序、各艺人参与顺序、生成的推荐码、POP奖励预留状态、ORIGIN 100候选资格', '提供预注册结果、正式上线后账号绑定及权益核实'],
            ] },
            { kind: 'p', text: '推荐码及营销信息接收同意均为选填项，不填写或不同意也可完成预注册。公司在预注册阶段不会收集身份证号、支付信息或精确位置信息。' },
          ],
        },
        {
          n: '2', title: '保留及使用期限',
          blocks: [
            { kind: 'ul', items: [
              '预注册信息：自发送正式上线通知及完成权益绑定之日起30日内销毁。',
              '已绑定至正式应用账号的信息：经用户另行同意后转移至应用账号信息，此后依正式应用隐私政策处理。',
              '撤回同意或申请删除时：除法律法规规定须保留外，将无延迟销毁。',
              '不正当使用及纠纷应对记录：在必要最小范围内，可保留至相关纠纷处理完毕。',
              '相关法律法规另有规定保存期限的：依该法律法规规定的期限保留。',
            ] },
            { kind: 'p', text: '保留目的达成后，电子文件将以难以恢复的方式删除。' },
          ],
        },
        {
          n: '3', title: '个人信息处理委托及跨境传输',
          blocks: [
            { kind: 'p', text: '为稳定运营网站服务，公司可能使用以下服务商。实际使用的服务商或处理地点发生变更时，本政策将相应更新。' },
            { kind: 'table', head: ['受托方', '业务', '传输国家·时点·方式', '保留期限'], rows: [
              ['Vercel Inc.', '网站托管、部署、请求处理、安全及错误日志', '美国及Vercel下级处理方运营所在国家 / 访问网站或提交表单时进行加密网络传输', '服务提供合同期间或目的达成之前'],
              ['Supabase Inc.', '数据库、预注册信息存储、安全运营', '项目数据原则上使用首尔区域，运营·支持过程中可能在美国等下级处理方运营国家进行有限处理 / 提交表单时进行加密传输', '预注册信息保留期限或合同终止之前'],
            ] },
            { kind: 'p', text: '用户可以不同意跨境传输，但这可能限制预注册的提交。有关跨境传输的咨询或同意撤回，可通过 help@fanuzu.co.kr 提出。' },
            { kind: 'p', text: '目前尚未确定单独的邮件发送服务商（TODO）。引入时将提前公开服务商名称、传输国家、处理目的及保留期限。' },
          ],
        },
        {
          n: '4', title: '用户权利及行使方法',
          blocks: [
            { kind: 'p', text: '用户可就本人个人信息要求查阅、更正、删除、停止处理及撤回同意（含撤回营销信息接收同意）。请求可发送至 help@fanuzu.co.kr，经身份确认后处理。' },
            { kind: 'p', text: '推荐码的适用、POP奖励的预留及ORIGIN 100候选顺序，与个人信息更正无关，可依运营政策及不正当使用核查结果进行调整。' },
          ],
        },
        {
          n: '5', title: '未满14周岁用户使用限制',
          blocks: [{ kind: 'p', text: 'FANUZU 预注册仅限满14周岁及以上人员使用。公司确认申请人未满14周岁的，将无延迟删除该申请及相关信息。正式服务将依据各国同意年龄标准，另行审查法定代理人同意程序。' }],
        },
        {
          n: '6', title: '安全保障措施',
          blocks: [{ kind: 'ul', items: [
            '传输区间加密（HTTPS）',
            '管理权限最小化及访问控制',
            '密钥与管理员密钥同源代码分离',
            '日志记录及不正当注册检测，基于IP的请求频率限制',
            '定期漏洞检查及最小化数据收集',
          ] }],
        },
        {
          n: '7', title: 'Cookie及类似技术',
          blocks: [{ kind: 'p', text: '本网站为保存语言选择等必要功能使用浏览器本地存储。目前不使用分析、广告等非必要Cookie。日后引入此类工具时，将在本政策中补充同意横幅及拒绝方式。' }],
        },
        {
          n: '8', title: '个人信息保护负责人及权益侵害救济',
          blocks: [
            { kind: 'p', text: 'Fancake Inc. / 代表人 Syvia Hong / 工商注册号 2748603844' },
            { kind: 'p', text: '117, Bundangnaegok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea' },
            { kind: 'p', text: '客服邮箱：help@fanuzu.co.kr / 个人信息保护负责人：Jimin Lee' },
            { kind: 'p', text: '如需个人信息侵害相关咨询，可联系个人信息侵害举报中心（无需区号118）、个人信息纠纷调解委员会等相关机构。' },
          ],
        },
        {
          n: '9', title: '政策变更',
          blocks: [{ kind: 'p', text: '本政策内容发生变更时，将在生效日至少7日前通过网站进行公告。对用户权利有重大影响的变更，将另行给予合理的告知期。' }],
        },
      ],
      contactLine: '联系方式：help@fanuzu.co.kr',
      backLink: '← 返回 FANUZU',
    },
  },

  zhHant: {
    terms: {
      eyebrow: 'TERMS OF SERVICE',
      title: 'FANUZU 預先註冊服務使用條款',
      effective: EFFECTIVE_ZH_HANT,
      infoBoxLabel: '重要提示',
      infoBoxText: '本條款適用於 FANUZU 正式應用程式上線前的網站體驗、粉絲星球創建申請、預先註冊、推薦碼、POP 獎勵預留，以及 FANUZU PASSPORT 與 ORIGIN 100 候選資格的運營。',
      tocLabel: '目錄',
      toc: [
        '1. 目的與定義', '2. 預先註冊與使用資格', '3. 粉絲星球申請', '4. 推薦碼與POP',
        '5. PASSPORT與稱號', '6. 禁止行為', '7. 服務變更與中斷', '8. 智慧財產權與藝人關係',
        '9. 責任限制', '10. 適用法律與爭議',
      ],
      articles: [
        {
          n: '第1條', title: '目的及定義',
          blocks: [
            { kind: 'p', text: '本條款規定了 Fancake Inc.（以下稱「公司」）提供的 FANUZU 預先註冊網站及相關功能的使用條件。' },
            { kind: 'defs', items: [
              { term: 'POP', text: '記錄粉絲時間與行動的 FANUZU 非現金貢獻積分。' },
              { term: '粉絲星球', text: 'FANUZU 內將支持特定藝人的粉絲的貢獻與活動可視化的共同空間。' },
              { term: 'FANUZU PASSPORT', text: '顯示使用者參與、貢獻、活動、成長階段、稱號等資訊的數位粉絲身分證明及活動記錄。' },
              { term: 'PLANET FOUNDER', text: '可授予最先有效提議創建某粉絲星球的使用者的限定角色。' },
              { term: 'ORIGIN 100', text: '經核實後，可授予有效參與某粉絲星球最初100名使用者的創立稱號。' },
              { term: '推薦碼', text: '用於連接預先註冊使用者並確認獎勵資格的唯一代碼。' },
            ] },
          ],
        },
        {
          n: '第2條', title: '預先註冊及使用資格',
          blocks: [{ kind: 'ul', items: [
            '僅限滿14週歲及以上人員申請預先註冊。',
            '使用者須填寫本人使用的有效電子郵箱及準確資訊。',
            '需完成郵箱驗證，並在正式上線後完成首次登入或帳號綁定，POP發放及限定稱號才能最終確定。',
            '預先註冊本身並不保證創建正式服務帳號、無條件獲得任何權益、服務上線日期或特定功能的提供。',
          ] }],
        },
        {
          n: '第3條', title: '粉絲星球創建申請',
          blocks: [{ kind: 'ul', items: [
            '使用者可輸入關注的藝人姓名申請創建新的粉絲星球，或加入已有申請。',
            '若同一藝人以不同名稱、拼寫或藝名被重複申請，公司可審核後進行合併、修改或拆分。',
            '粉絲星球的創建將綜合考慮申請人數、潛在權利侵害風險、運營可行性及服務政策等因素。',
            'PLANET FOUNDER 的認定不僅依據最早提交時間，還需核實是否存在重複、虛假、侵權或自動化申請等情形後方可確定。',
            '若藝人、所屬經紀公司或官方粉絲俱樂部提出要求，或存在權利侵害風險，星球名稱、展示方式或運營狀態可能發生變更。',
          ] }],
        },
        {
          n: '第4條', title: '推薦碼及POP獎勵',
          blocks: [
            { kind: 'ul', items: [
              '推薦碼為選填項，不填寫推薦碼也可完成預先註冊。',
              '未填寫推薦碼有效預先註冊的新使用者將獲得預留的50 POP。',
              '填寫有效推薦碼完成預先註冊後，新使用者與推薦人將各獲得預留的100 POP。',
              'POP 須在完成郵箱驗證及正式上線後首次登入或帳號綁定後方可發放。',
              '每次申請僅可使用一個推薦碼，註冊完成後原則上不可更改。',
              '自我推薦、同一人使用多個帳號、虛假郵箱、自動化註冊、買賣推薦碼，以及以獲取獎勵為唯一目的的異常註冊，均視為無效。',
              '推薦數量不會提前使用者的 ORIGIN 100 順序。',
              'POP 並非現金、電子貨幣、存款或有價證券，不可兌換為現金，也不可在使用者之間買賣或轉讓。',
              '預先註冊 POP 的使用範圍、有效期及消耗方式將在正式上線政策中具體明確；對使用者不利的重大變更將提前告知。',
            ] },
            { kind: 'p', text: '詳細標準可參閱《預先註冊·推薦·POP運營政策》。' },
          ],
        },
        {
          n: '第5條', title: 'FANUZU PASSPORT、PLANET FOUNDER 及 ORIGIN 100',
          blocks: [{ kind: 'ul', items: [
            '網站展示的 PASSPORT 可能是用於說明正式服務規劃功能的預覽。',
            '護照中顯示的累積貢獻、活動、成長階段及徽章，均依據公司核實後的活動記錄展示。',
            'ORIGIN 100 的評定並非依據付款金額或推薦數量，而是依據在各粉絲星球中有效預先註冊並完成所需驗證的先後順序。',
            '由於伺服器記錄、重複合併、不正當使用核查及藝人名稱整合等原因，顯示順序可能與臨時順序不同。',
            '如存在不正當註冊、違反服務政策、侵犯權利或星球合併·關閉等情形，候選資格或稱號可能被取消或調整。',
            '稱號及徽章為榮譽性記錄，不代表財產權、經營權、投票權或對藝人本人的任何權利。',
          ] }],
        },
        {
          n: '第6條', title: '禁止行為',
          blocks: [
            { kind: 'ul', items: [
              '擅自使用他人的電子郵箱或資訊',
              '自我推薦、使用多個帳號、使用巨集、機器人或其他自動化工具',
              '買賣推薦碼、進行有償交易或發布垃圾訊息',
              '使人誤以為與藝人或所屬經紀公司存在官方合作關係的行為',
              '侵犯他人著作權、商標權及姓名·肖像相關權利',
              '妨害服務安全或正常運營的行為',
            ] },
            { kind: 'p', text: '公司可取消違規申請，並使相關POP、推薦記錄、PASSPORT記錄及稱號失效。' },
          ],
        },
        {
          n: '第7條', title: '服務變更、上線及中斷',
          blocks: [
            { kind: 'p', text: '公司可根據開發進度、審核、法律法規、第三方平台政策、權利關係或運營需要，變更上線時間、功能、名稱、設計、POP政策及活動結構。重大變更將透過網站或註冊郵箱進行告知。' },
            { kind: 'p', text: '如遇自然災害、系統故障、駭客攻擊、第三方服務中斷等公司難以合理控制的事由，服務可能暫時中斷。' },
          ],
        },
        {
          n: '第8條', title: '智慧財產權及官方關係的否認',
          blocks: [
            { kind: 'p', text: 'FANUZU 名稱、標識、頁面及自主製作的星球與內容相關權利歸公司所有。' },
            { kind: 'p', text: '使用者填寫的藝人姓名將作為確認粉絲星球創建需求的識別資訊進行處理。除另有明確說明外，FANUZU 與相關藝人、所屬經紀公司、電視台或官方粉絲俱樂部之間不存在合作、贊助或認可關係。' },
            { kind: 'p', text: '使用者不得未經授權上傳或向公司提供他人的照片、標識、專輯圖像、影像、粉絲創作作品等內容。' },
          ],
        },
        {
          n: '第9條', title: '責任限制',
          blocks: [{ kind: 'p', text: '除存在故意或重大過失外，公司對因使用者資訊填寫錯誤、郵箱接收設定、推薦碼輸入錯誤或第三方服務故障所造成的損害不承擔責任。但相關法律法規規定不可免除的責任不在此列。' }],
        },
        {
          n: '第10條', title: '適用法律及爭議解決',
          blocks: [{ kind: 'p', text: '本條款適用大韓民國法律。發生爭議時，公司與使用者應誠實協商；協商未能解決的，依相關法律法規提交有管轄權的法院解決。' }],
        },
      ],
      contactLine: '聯絡方式：help@fanuzu.co.kr',
      backLink: '← 返回 FANUZU',
    },
    privacy: {
      eyebrow: 'PRIVACY POLICY',
      title: '隱私政策',
      effective: EFFECTIVE_ZH_HANT,
      infoBoxLabel: '重要提示',
      infoBoxText: '本政策規定了 FANUZU 預先註冊頁面處理電子郵箱、關注藝人、粉絲團名稱、入坑年份、語言及推薦碼等資訊的標準。正式應用程式開放會員註冊、社群、步數、廣告及支付功能後，將另行修訂為統一的隱私政策。',
      tocLabel: '目錄',
      toc: [
        '1. 處理的個人資訊與目的', '2. 保留及使用期限', '3. 處理委託及跨境傳輸', '4. 使用者權利',
        '5. 未滿14週歲使用者使用限制', '6. 安全保障措施', '7. Cookie及連線資訊', '8. 聯絡方式及權益救濟', '9. 政策變更',
      ],
      articles: [
        {
          n: '1', title: '處理的個人資訊與目的',
          blocks: [
            { kind: 'table', head: ['類別', '項目', '目的'], rows: [
              ['必填', '電子郵箱、關注藝人姓名、使用語言、必填同意（使用條款/隱私政策）情況及同意時間', '受理預先註冊、發送上線通知、識別申請人、防止重複申請、處理諮詢'],
              ['選填', '粉絲團名稱、入坑年份、推薦碼、行銷資訊接收同意情況', '統計粉絲星球創建需求、確認推薦關係、預留預先註冊POP獎勵、發送消息與推廣資訊'],
              ['自動生成', '存取時間、IP位址、瀏覽器·裝置資訊、語言設定、服務使用記錄、錯誤日誌', '安全保障、偵測不正當及重複申請、故障應對、提升服務品質'],
              ['預先註冊結果', '預先註冊順序、各藝人參與順序、生成的推薦碼、POP獎勵預留狀態、ORIGIN 100候選資格', '提供預先註冊結果、正式上線後帳號綁定及權益核實'],
            ] },
            { kind: 'p', text: '推薦碼及行銷資訊接收同意均為選填項，不填寫或不同意也可完成預先註冊。公司在預先註冊階段不會收集身分證號、支付資訊或精確位置資訊。' },
          ],
        },
        {
          n: '2', title: '保留及使用期限',
          blocks: [
            { kind: 'ul', items: [
              '預先註冊資訊：自發送正式上線通知及完成權益綁定之日起30日內銷毀。',
              '已綁定至正式應用程式帳號的資訊：經使用者另行同意後轉移至應用程式帳號資訊，此後依正式應用程式隱私政策處理。',
              '撤回同意或申請刪除時：除法律法規規定須保留外，將無延遲銷毀。',
              '不正當使用及糾紛應對記錄：在必要最小範圍內，可保留至相關糾紛處理完畢。',
              '相關法律法規另有規定保存期限的：依該法律法規規定的期限保留。',
            ] },
            { kind: 'p', text: '保留目的達成後，電子檔案將以難以復原的方式刪除。' },
          ],
        },
        {
          n: '3', title: '個人資訊處理委託及跨境傳輸',
          blocks: [
            { kind: 'p', text: '為穩定運營網站服務，公司可能使用以下服務商。實際使用的服務商或處理地點發生變更時，本政策將相應更新。' },
            { kind: 'table', head: ['受託方', '業務', '傳輸國家·時點·方式', '保留期限'], rows: [
              ['Vercel Inc.', '網站託管、部署、請求處理、安全及錯誤日誌', '美國及Vercel下級處理方運營所在國家 / 存取網站或提交表單時進行加密網路傳輸', '服務提供合約期間或目的達成之前'],
              ['Supabase Inc.', '資料庫、預先註冊資訊儲存、安全運營', '專案資料原則上使用首爾區域，運營·支援過程中可能在美國等下級處理方運營國家進行有限處理 / 提交表單時進行加密傳輸', '預先註冊資訊保留期限或合約終止之前'],
            ] },
            { kind: 'p', text: '使用者可以不同意跨境傳輸，但這可能限制預先註冊的提交。有關跨境傳輸的諮詢或同意撤回，可透過 help@fanuzu.co.kr 提出。' },
            { kind: 'p', text: '目前尚未確定單獨的電子郵件發送服務商（TODO）。引入時將提前公開服務商名稱、傳輸國家、處理目的及保留期限。' },
          ],
        },
        {
          n: '4', title: '使用者權利及行使方法',
          blocks: [
            { kind: 'p', text: '使用者可就本人個人資訊要求查閱、更正、刪除、停止處理及撤回同意（含撤回行銷資訊接收同意）。請求可傳送至 help@fanuzu.co.kr，經身分確認後處理。' },
            { kind: 'p', text: '推薦碼的適用、POP獎勵的預留及ORIGIN 100候選順序，與個人資訊更正無關，可依運營政策及不正當使用核查結果進行調整。' },
          ],
        },
        {
          n: '5', title: '未滿14週歲使用者使用限制',
          blocks: [{ kind: 'p', text: 'FANUZU 預先註冊僅限滿14週歲及以上人員使用。公司確認申請人未滿14週歲的，將無延遲刪除該申請及相關資訊。正式服務將依據各國同意年齡標準，另行審查法定代理人同意程序。' }],
        },
        {
          n: '6', title: '安全保障措施',
          blocks: [{ kind: 'ul', items: [
            '傳輸區間加密（HTTPS）',
            '管理權限最小化及存取控制',
            '密鑰與管理員密鑰同原始碼分離',
            '日誌記錄及不正當註冊偵測，基於IP的請求頻率限制',
            '定期弱點檢查及最小化資料收集',
          ] }],
        },
        {
          n: '7', title: 'Cookie及類似技術',
          blocks: [{ kind: 'p', text: '本網站為保存語言選擇等必要功能使用瀏覽器本機儲存空間。目前不使用分析、廣告等非必要Cookie。日後引入此類工具時，將在本政策中補充同意橫幅及拒絕方式。' }],
        },
        {
          n: '8', title: '個人資訊保護負責人及權益侵害救濟',
          blocks: [
            { kind: 'p', text: 'Fancake Inc. / 代表人 Syvia Hong / 工商註冊號 2748603844' },
            { kind: 'p', text: '117, Bundangnaegok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea' },
            { kind: 'p', text: '客服郵箱：help@fanuzu.co.kr / 個人資訊保護負責人：Jimin Lee' },
            { kind: 'p', text: '如需個人資訊侵害相關諮詢，可聯絡個人資訊侵害檢舉中心（免區碼118）、個人資訊糾紛調解委員會等相關機構。' },
          ],
        },
        {
          n: '9', title: '政策變更',
          blocks: [{ kind: 'p', text: '本政策內容發生變更時，將在生效日至少7日前透過網站進行公告。對使用者權利有重大影響的變更，將另行給予合理的告知期。' }],
        },
      ],
      contactLine: '聯絡方式：help@fanuzu.co.kr',
      backLink: '← 返回 FANUZU',
    },
  },
};
