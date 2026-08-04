import Link from 'next/link';
import LegalLayout, { Article, DefTerm, InfoBox } from '@/components/legal/LegalLayout';

export const metadata = { title: '이용약관 — FANUZU' };

const TOC = [
  '1. 목적과 용어',
  '2. 사전등록 및 이용 자격',
  '3. 팬덤 행성 신청',
  '4. 추천 코드와 POP',
  '5. PASSPORT와 칭호',
  '6. 금지행위',
  '7. 서비스 변경 및 중단',
  '8. 지식재산권과 아티스트 관계',
  '9. 책임 제한',
  '10. 준거법 및 분쟁',
];

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="TERMS OF SERVICE"
      title="FANUZU 사전등록 서비스 이용약관"
      effective="시행일: 2026년 8월 4일 · 버전 1.0"
    >
      <InfoBox label="중요">
        이 약관은 FANUZU 정식 앱 출시 전의 홈페이지 체험, 팬덤 행성 생성 신청, 사전등록, 추천 코드, POP 보상 예약, FANUZU
        PASSPORT 및 ORIGIN 100 후보 운영에 적용됩니다.
      </InfoBox>

      <nav style={{ margin: '32px 0 48px' }}>
        <div style={{ fontSize: 12.5, color: '#6B6478', marginBottom: 10, letterSpacing: '.05em' }}>목차</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', color: '#B8AFC4', fontSize: 14, lineHeight: 1.9 }}>
          {TOC.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </nav>

      <Article n="제1조" title="목적 및 용어">
        <p>이 약관은 Fancake Inc.(이하 “회사”)가 제공하는 FANUZU 사전등록 홈페이지와 관련 기능의 이용 조건을 정합니다.</p>
        <DefTerm term="POP">팬의 시간과 행동을 기록하는 FANUZU의 비현금성 기여 포인트입니다.</DefTerm>
        <DefTerm term="팬덤 행성">특정 아티스트를 응원하는 팬들의 기여와 활동을 시각화한 FANUZU 내 공동 공간입니다.</DefTerm>
        <DefTerm term="FANUZU PASSPORT">이용자의 참여, 기여, 캠페인, 성장 단계, 칭호 등을 표시하는 디지털 팬 ID 및 활동 기록입니다.</DefTerm>
        <DefTerm term="PLANET FOUNDER">팬덤 행성 생성을 최초로 유효하게 제안한 이용자에게 부여할 수 있는 한정 역할입니다.</DefTerm>
        <DefTerm term="ORIGIN 100">각 팬덤 행성에 유효하게 참여한 최초 100명에게 검증 후 부여할 수 있는 창립 칭호입니다.</DefTerm>
        <DefTerm term="추천 코드">사전등록 이용자를 연결하고 보상 조건을 확인하기 위한 고유 코드입니다.</DefTerm>
      </Article>

      <Article n="제2조" title="사전등록 및 이용 자격">
        <ul>
          <li>사전등록은 만 14세 이상만 신청할 수 있습니다.</li>
          <li>이용자는 본인이 사용하는 유효한 이메일과 정확한 정보를 입력해야 합니다.</li>
          <li>이메일 인증, 정식 출시 후 최초 로그인 또는 계정 연동이 완료되어야 POP 지급 및 한정 칭호가 최종 확정될 수 있습니다.</li>
          <li>사전등록 자체는 정식 서비스 계정 생성, 특정 혜택의 무조건적인 지급, 서비스 출시일 또는 특정 기능 제공을 보장하지 않습니다.</li>
        </ul>
      </Article>

      <Article n="제3조" title="팬덤 행성 생성 신청">
        <ul>
          <li>이용자는 관심 아티스트명을 입력하여 신규 팬덤 행성 생성을 신청하거나 기존 신청에 참여할 수 있습니다.</li>
          <li>동일 아티스트가 다른 이름·표기·활동명으로 중복 신청된 경우 회사는 검토 후 통합, 수정 또는 분리할 수 있습니다.</li>
          <li>팬덤 행성은 신청자 수, 권리 침해 가능성, 운영 가능성, 서비스 정책 등을 검토하여 생성됩니다.</li>
          <li>PLANET FOUNDER 표시는 최초 입력 시각만이 아니라 중복·허위·권리침해·자동화 신청 여부 등을 검증한 뒤 확정합니다.</li>
          <li>아티스트, 소속사 또는 공식 팬클럽의 요청이나 권리 침해 우려가 있는 경우 행성명, 표시 방식 또는 운영 상태가 변경될 수 있습니다.</li>
        </ul>
      </Article>

      <Article n="제4조" title="추천 코드 및 POP 보상">
        <ul>
          <li>추천 코드는 선택사항이며, 추천 코드 없이도 사전등록할 수 있습니다.</li>
          <li>추천 코드 없이 유효하게 사전등록하면 신규 이용자에게 50 POP이 예약됩니다.</li>
          <li>유효한 추천 코드를 입력해 사전등록하면 신규 이용자와 추천인에게 각각 100 POP이 예약됩니다.</li>
          <li>POP은 이메일 인증 및 정식 출시 후 최초 로그인 또는 계정 연동이 완료된 뒤 지급할 수 있습니다.</li>
          <li>한 신청에는 하나의 추천 코드만 적용되며, 등록 완료 후에는 원칙적으로 변경할 수 없습니다.</li>
          <li>자기 추천, 동일인 다중 계정, 허위 이메일, 자동화 가입, 코드 거래, 보상만을 목적으로 한 비정상 가입은 무효 처리됩니다.</li>
          <li>추천 수는 ORIGIN 100 순번을 앞당기지 않습니다.</li>
          <li>POP은 현금, 전자화폐, 예금, 유가증권이 아니며 현금으로 환전하거나 이용자 간 판매·양도할 수 없습니다.</li>
          <li>사전등록 POP의 사용처, 유효기간, 소진 방식은 정식 출시 정책에서 구체화되며, 이용자에게 불리한 중대한 변경은 사전 안내합니다.</li>
        </ul>
        <p style={{ marginTop: 12 }}>상세 기준은 사전등록·추천·POP 운영정책에서 확인할 수 있습니다.</p>
      </Article>

      <Article n="제5조" title="FANUZU PASSPORT, PLANET FOUNDER 및 ORIGIN 100">
        <ul>
          <li>홈페이지에 표시되는 PASSPORT는 정식 서비스의 예정 기능을 설명하기 위한 미리보기일 수 있습니다.</li>
          <li>패스포트의 누적 기여, 캠페인, 성장 단계, 배지는 회사가 검증한 활동 기록에 따라 표시됩니다.</li>
          <li>ORIGIN 100은 결제 금액이나 추천 수가 아니라 각 팬덤 행성에 유효하게 사전등록하고 필요한 인증을 완료한 순서를 기준으로 합니다.</li>
          <li>표시 순번은 서버 기록, 중복 통합, 부정 이용 검증, 아티스트명 통합에 따라 임시 순번과 달라질 수 있습니다.</li>
          <li>부정 가입, 서비스 정책 위반, 권리 침해 또는 행성 통합·폐쇄 사유가 있는 경우 후보 자격 또는 칭호가 취소·조정될 수 있습니다.</li>
          <li>칭호와 배지는 명예 기록이며 재산권, 경영권, 투표 지분 또는 아티스트에 대한 권리를 의미하지 않습니다.</li>
        </ul>
      </Article>

      <Article n="제6조" title="금지행위">
        <ul>
          <li>타인의 이메일 또는 정보를 무단 사용</li>
          <li>자기 추천, 다중 계정, 매크로, 봇, 자동화 도구 사용</li>
          <li>추천 코드 판매, 대가성 거래, 스팸 배포</li>
          <li>아티스트·소속사와 공식 제휴한 것처럼 오인시키는 행위</li>
          <li>타인의 저작권, 상표권, 성명·초상 관련 권리 침해</li>
          <li>서비스 보안 또는 정상 운영을 방해하는 행위</li>
        </ul>
        <p style={{ marginTop: 12 }}>회사는 위반 신청을 취소하고 POP, 추천 실적, PASSPORT 기록 및 칭호를 무효화할 수 있습니다.</p>
      </Article>

      <Article n="제7조" title="서비스 변경, 출시 및 중단">
        <p>
          회사는 개발, 심사, 법령, 제3자 플랫폼 정책, 권리관계 또는 운영상 필요에 따라 출시 일정, 기능, 명칭, 디자인, POP
          정책, 캠페인 구조를 변경할 수 있습니다. 중요한 변경은 홈페이지 또는 등록 이메일을 통해 안내합니다.
        </p>
        <p>천재지변, 장애, 해킹, 제3자 서비스 중단 등 합리적으로 통제하기 어려운 사유가 있는 경우 서비스가 일시 중단될 수 있습니다.</p>
      </Article>

      <Article n="제8조" title="지식재산권 및 공식 관계의 부인">
        <p>FANUZU 명칭, 로고, 화면, 자체 제작 행성 및 콘텐츠에 대한 권리는 회사에 있습니다.</p>
        <p>
          이용자가 입력한 아티스트명은 팬덤 행성 수요 확인을 위한 식별 정보로 처리됩니다. 별도로 명시하지 않는 한 FANUZU는
          해당 아티스트, 소속사, 방송사 또는 공식 팬클럽과 제휴·후원·승인 관계가 아닙니다.
        </p>
        <p>이용자는 타인의 사진, 로고, 앨범 이미지, 영상, 팬아트 등을 권한 없이 업로드하거나 회사에 제공해서는 안 됩니다.</p>
      </Article>

      <Article n="제9조" title="책임 제한">
        <p>
          회사는 고의 또는 중대한 과실이 없는 한 이용자의 잘못된 정보 입력, 이메일 수신 설정, 추천 코드 오입력, 제3자
          서비스 장애로 발생한 손해에 책임을 지지 않습니다. 다만 관계 법령상 배제할 수 없는 책임은 제외하지 않습니다.
        </p>
      </Article>

      <Article n="제10조" title="준거법 및 분쟁 해결">
        <p>
          이 약관은 대한민국 법률에 따릅니다. 분쟁이 발생한 경우 회사와 이용자는 성실히 협의하며, 해결되지 않는 경우
          관계 법령에 따른 관할 법원에서 해결합니다.
        </p>
      </Article>

      <p style={{ marginTop: 40, fontSize: 13.5, color: '#6B6478' }}>
        문의: <a href="mailto:help@fanuzu.co.kr" style={{ color: '#B8AFC4' }}>help@fanuzu.co.kr</a>
      </p>

      <Link href="/" style={{ display: 'inline-block', marginTop: 40, color: '#FF7DDD', fontSize: 14, textDecoration: 'none' }}>
        ← FANUZU로 돌아가기
      </Link>
    </LegalLayout>
  );
}
