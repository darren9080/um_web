import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '울산매일UTV 개인정보처리방침. 수집 항목, 이용 목적, 보유 기간, 제3자 제공 등을 안내합니다.',
};

export default function PrivacyPage() {
  return (
    <div className="container-main py-12">
      <div className="max-w-article mx-auto">
        <div className="mb-10">
          <p className="text-caption font-semibold tracking-widest text-neutral-400 uppercase mb-3">
            Privacy Policy
          </p>
          <h1
            className="text-display-sm font-bold text-neutral-900 mb-4"
            style={{ fontFamily: '"Noto Serif KR", serif' }}
          >
            개인정보처리방침
          </h1>
          <p className="text-body-sm text-neutral-500">
            (주)울산매일신문사 (이하 "회사")는 개인정보보호법, 정보통신망 이용촉진 및
            정보보호 등에 관한 법률에 따라 이용자의 개인정보를 보호하기 위해
            다음과 같이 개인정보처리방침을 수립·공개합니다.
          </p>
          <p className="text-caption text-neutral-400 mt-2">
            시행일: 2026년 01월 28일 · 최종 개정: 2026년 06월 01일
          </p>
        </div>

        <div className="article-prose space-y-10">

          <section>
            <h2>제1조 (수집하는 개인정보 항목 및 수집 방법)</h2>
            <p>회사는 서비스 제공을 위해 다음의 개인정보를 수집합니다.</p>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-body-sm border border-neutral-200 rounded-lg overflow-hidden">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700 border-b border-neutral-200">수집 목적</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700 border-b border-neutral-200">수집 항목</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700 border-b border-neutral-200">보유 기간</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    ['소셜 로그인 (구글)', '이름, 이메일, 프로필 사진', '회원 탈퇴 시'],
                    ['소셜 로그인 (네이버)', '이름, 이메일, 닉네임', '회원 탈퇴 시'],
                    ['소셜 로그인 (카카오)', '닉네임, 프로필 사진, 이메일(선택)', '회원 탈퇴 시'],
                    ['유료 구독·결제', '결제 수단 정보(토스페이먼츠 처리), 이메일', '5년 (전자상거래법)'],
                    ['이벤트 신청', '이름, 연락처, 이메일', '행사 종료 후 1년'],
                    ['뉴스레터 구독', '이메일', '구독 해지 시'],
                    ['광고 문의', '회사명, 담당자명, 이메일, 연락처', '문의 처리 후 1년'],
                    ['서비스 이용 기록', 'IP 주소, 쿠키, 접속 로그', '1년'],
                  ].map(([purpose, items, retention]) => (
                    <tr key={purpose}>
                      <td className="px-4 py-3 text-neutral-700">{purpose}</td>
                      <td className="px-4 py-3 text-neutral-600">{items}</td>
                      <td className="px-4 py-3 text-neutral-600">{retention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>제2조 (개인정보의 이용 목적)</h2>
            <p>수집한 개인정보는 다음 목적에만 이용합니다.</p>
            <ul>
              <li>회원 가입 및 관리, 본인 확인</li>
              <li>유료 서비스(구독, 이벤트 티켓) 제공 및 결제</li>
              <li>뉴스레터 및 서비스 안내 발송</li>
              <li>이벤트 신청 접수 및 결과 안내</li>
              <li>서비스 개선을 위한 통계 분석</li>
              <li>법적 의무 이행 및 분쟁 해결</li>
            </ul>
          </section>

          <section>
            <h2>제3조 (개인정보의 제3자 제공)</h2>
            <p>
              회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
              단, 다음의 경우에는 예외로 합니다.
            </p>
            <ul>
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령에 따라 수사기관의 요청이 있는 경우</li>
              <li>결제 처리를 위해 토스페이먼츠(주)에 결제 정보를 전달하는 경우</li>
            </ul>
          </section>

          <section>
            <h2>제4조 (개인정보 처리 위탁)</h2>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-body-sm border border-neutral-200 rounded-lg overflow-hidden">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700 border-b border-neutral-200">수탁 업체</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700 border-b border-neutral-200">위탁 업무</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    ['토스페이먼츠(주)', '결제 처리 및 결제 정보 관리'],
                    ['Supabase Inc.', '서비스 데이터베이스 운영'],
                    ['Vercel Inc.', '웹 서비스 호스팅 및 배포'],
                    ['Google LLC', '소셜 로그인 인증'],
                    ['Stibee (에스티비)', '뉴스레터 이메일 발송'],
                  ].map(([company, task]) => (
                    <tr key={company}>
                      <td className="px-4 py-3 text-neutral-700">{company}</td>
                      <td className="px-4 py-3 text-neutral-600">{task}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>제5조 (이용자의 권리와 행사 방법)</h2>
            <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
            <ul>
              <li>개인정보 열람, 정정, 삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
              <li>동의 철회 (회원 탈퇴)</li>
            </ul>
            <p>
              권리 행사는 <strong>contact@ulsanmaeil.co.kr</strong> 또는
              대표전화 <strong>052-243-1001</strong>로 요청하시면 5영업일 이내 조치합니다.
            </p>
          </section>

          <section>
            <h2>제6조 (쿠키 운영)</h2>
            <p>
              회사는 로그인 유지, 서비스 개선, 맞춤형 콘텐츠 제공을 위해 쿠키를 사용합니다.
              브라우저 설정에서 쿠키를 거부할 수 있으나, 일부 서비스 이용이 제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2>제7조 (개인정보 보호책임자)</h2>
            <div className="bg-neutral-50 rounded-xl p-5 text-body-sm">
              <p><strong>성명:</strong> 김진영</p>
              <p><strong>직책:</strong> 청소년보호책임자 겸 개인정보 보호책임자</p>
              <p><strong>이메일:</strong> <a href="mailto:privacy@ulsanmaeil.co.kr" className="text-accent hover:underline">privacy@ulsanmaeil.co.kr</a></p>
              <p><strong>전화:</strong> 052-243-1001</p>
            </div>
            <p className="mt-4">
              개인정보 침해 신고는 개인정보보호위원회 (privacy.go.kr, 국번없이 182) 또는
              한국인터넷진흥원 개인정보침해신고센터 (privacy.kisa.or.kr, 국번없이 118)에
              하실 수 있습니다.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
