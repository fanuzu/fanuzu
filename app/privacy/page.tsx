import Link from 'next/link';
import LegalLayout, { Article, InfoBox, LegalTable } from '@/components/legal/LegalLayout';

export const metadata = { title: '개인정보처리방침 — FANUZU' };

const TOC = [
  '1. 처리하는 개인정보와 목적',
  '2. 보유 및 이용기간',
  '3. 처리위탁 및 국외 이전',
  '4. 이용자의 권리',
  '5. 만 14세 미만 이용 제한',
  '6. 안전성 확보조치',
  '7. 쿠키와 접속정보',
  '8. 담당자 및 권익침해 구제',
  '9. 변경 고지',
];

export default function PrivacyPage() {
  return (
    <LegalLayout eyebrow="PRIVACY POLICY" title="개인정보처리방침" effective="시행일: 2026년 8월 4일 · 버전 1.0">
      <InfoBox label="핵심 안내">
        이 방침은 FANUZU 사전등록 페이지에서 이메일, 관심 아티스트, 팬덤명, 입덕 연도, 언어, 추천인 코드 등을 처리하는
        기준입니다. 정식 앱에서 회원가입·커뮤니티·걸음 수·광고·결제 기능이 시작되면 별도의 통합 개인정보처리방침으로
        개정됩니다.
      </InfoBox>

      <nav style={{ margin: '32px 0 48px' }}>
        <div style={{ fontSize: 12.5, color: '#6B6478', marginBottom: 10, letterSpacing: '.05em' }}>목차</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', color: '#B8AFC4', fontSize: 14, lineHeight: 1.9 }}>
          {TOC.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </nav>

      <Article n="1" title="처리하는 개인정보와 목적">
        <LegalTable
          head={['구분', '항목', '목적']}
          rows={[
            [
              '필수',
              '이메일, 관심 아티스트명, 이용 언어, 만 14세 이상 확인 여부, 개인정보 동의 여부 및 동의 일시',
              '사전등록 접수, 출시 알림, 신청자 식별, 중복 신청 방지, 문의 대응',
            ],
            [
              '선택',
              '팬덤명, 입덕 연도, 추천인 코드',
              '팬덤 행성 생성 수요 집계, 추천 관계 확인, 사전등록 POP 보상 예약',
            ],
            [
              '자동 생성',
              '접속 일시, IP 주소, 브라우저·기기 정보, 언어 설정, 서비스 이용기록, 오류 로그',
              '보안, 부정·중복 신청 탐지, 장애 대응, 서비스 품질 개선',
            ],
            [
              '사전등록 결과',
              '사전등록 순번, 아티스트별 참여 순번, 생성된 추천 코드, POP 보상 예약 상태, ORIGIN 100 후보 여부',
              '사전등록 결과 제공, 정식 출시 후 계정 연동 및 혜택 검증',
            ],
          ]}
        />
        <p>
          추천인 코드는 선택사항이며, 입력하지 않아도 사전등록할 수 있습니다. 회사는 주민등록번호, 결제정보, 정밀
          위치정보를 사전등록 단계에서 수집하지 않습니다.
        </p>
      </Article>

      <Article n="2" title="보유 및 이용기간">
        <ul>
          <li>사전등록 정보: 정식 출시 알림 발송 및 혜택 연동이 완료된 날부터 30일 이내 파기합니다.</li>
          <li>정식 앱 계정으로 연동한 정보: 이용자의 별도 동의를 받아 앱 계정 정보로 이전하며, 이후에는 정식 앱 개인정보처리방침에 따릅니다.</li>
          <li>동의 철회 또는 삭제 요청 시: 법령상 보관 의무가 없는 한 지체 없이 파기합니다.</li>
          <li>부정 이용 및 분쟁 대응 기록: 필요한 최소 범위에서 관련 분쟁이 종료될 때까지 보관할 수 있습니다.</li>
          <li>관계 법령이 별도 보존기간을 정한 경우: 해당 법령에서 정한 기간 동안 보관합니다.</li>
        </ul>
        <p style={{ marginTop: 12 }}>보유 목적이 달성되면 전자적 파일은 복구하기 어려운 방법으로 삭제합니다.</p>
      </Article>

      <Article n="3" title="개인정보 처리위탁 및 국외 이전">
        <p>
          회사는 안정적인 웹 서비스 운영을 위해 다음 사업자를 이용할 수 있습니다. 실제 적용 사업자나 처리 위치가
          변경되는 경우 이 방침을 갱신합니다.
        </p>
        <LegalTable
          head={['수탁자', '업무', '이전 국가·시점·방법', '보유기간']}
          rows={[
            [
              'Vercel Inc.',
              '웹 호스팅, 배포, 요청 처리, 보안 및 오류 로그',
              '미국 및 Vercel 하위처리자 운영 국가 / 홈페이지 접속 및 폼 요청 시 암호화된 네트워크 전송',
              '서비스 제공 계약 기간 또는 목적 달성 시까지',
            ],
            [
              'Supabase Inc.',
              '데이터베이스, 사전등록 정보 저장, 보안 운영',
              '프로젝트 데이터는 서울 리전 사용을 원칙으로 하며, 운영·지원 과정에서 미국 등 하위처리자 운영 국가에서 제한적으로 처리될 수 있음 / 폼 제출 시 암호화 전송',
              '사전등록 정보 보유기간 또는 계약 종료 시까지',
            ],
          ]}
        />
        <p>
          이용자는 국외 이전에 동의하지 않을 수 있으나, 이 경우 사전등록 제출이 제한될 수 있습니다. 국외 이전에 관한
          문의 또는 동의 철회는 <a href="mailto:help@fanuzu.co.kr" style={{ color: '#B8AFC4' }}>help@fanuzu.co.kr</a>로 요청할 수 있습니다.
        </p>
        <p>현재 별도의 이메일 발송업체는 확정되지 않았습니다. 도입 시 업체명, 이전 국가, 처리 목적과 보유기간을 사전에 공개합니다.</p>
      </Article>

      <Article n="4" title="이용자의 권리와 행사 방법">
        <p>
          이용자는 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지, 동의 철회를 요청할 수 있습니다. 요청은{' '}
          <a href="mailto:help@fanuzu.co.kr" style={{ color: '#B8AFC4' }}>help@fanuzu.co.kr</a>로 보내면 본인 확인 후 처리합니다.
        </p>
        <p>
          추천인 코드 적용, POP 보상 예약, ORIGIN 100 후보 순번은 개인정보 정정과 별개로 운영정책 및 부정 이용 검증
          결과에 따라 조정될 수 있습니다.
        </p>
      </Article>

      <Article n="5" title="만 14세 미만 이용 제한">
        <p>
          FANUZU 사전등록은 만 14세 이상만 이용할 수 있습니다. 회사가 만 14세 미만의 신청임을 확인하면 해당 신청과
          관련 정보를 지체 없이 삭제합니다.
        </p>
      </Article>

      <Article n="6" title="안전성 확보조치">
        <ul>
          <li>전송 구간 암호화(HTTPS)</li>
          <li>관리 권한 최소화 및 접근 통제</li>
          <li>비밀키와 관리자 키의 소스코드 분리</li>
          <li>로그 및 부정 가입 탐지</li>
          <li>정기적인 취약점 점검과 데이터 최소 수집</li>
        </ul>
      </Article>

      <Article n="7" title="쿠키 및 유사 기술">
        <p>
          홈페이지는 언어 선택 저장 등 이용 편의를 위해 브라우저 로컬 저장소 또는 쿠키를 사용할 수 있습니다. 향후 분석
          도구를 도입하는 경우 도구명, 수집 항목, 거부 방법을 이 방침에 추가합니다.
        </p>
      </Article>

      <Article n="8" title="개인정보 보호 담당자 및 권익침해 구제">
        <p>Fancake Inc. / 대표자 Syvia Hong / 사업자등록번호 2748603844</p>
        <p>117, Bundangnaegok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea</p>
        <p>
          고객문의: <a href="mailto:help@fanuzu.co.kr" style={{ color: '#B8AFC4' }}>help@fanuzu.co.kr</a> / 개인정보
          보호 담당자: 이지민
        </p>
        <p>
          개인정보 침해 상담이 필요한 경우 개인정보침해신고센터(국번 없이 118), 개인정보분쟁조정위원회 등 관계 기관에
          도움을 요청할 수 있습니다.
        </p>
      </Article>

      <Article n="9" title="방침의 변경">
        <p>
          이 방침의 내용이 변경되는 경우 시행일 최소 7일 전에 홈페이지를 통해 알립니다. 이용자 권리에 중대한 영향을
          주는 변경은 합리적인 기간을 두고 별도로 안내합니다.
        </p>
      </Article>

      <Link href="/" style={{ display: 'inline-block', marginTop: 24, color: '#FF7DDD', fontSize: 14, textDecoration: 'none' }}>
        ← FANUZU로 돌아가기
      </Link>
    </LegalLayout>
  );
}
