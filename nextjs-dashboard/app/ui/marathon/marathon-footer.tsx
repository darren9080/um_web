import Link from 'next/link';

export default function MarathonFooter() {
  return (
    <footer className="bg-brand-charcoal text-white/70 mt-20">
      <div className="container-main py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="font-black text-white text-body">울산매일마라톤</p>
            <p className="text-caption text-white/40 mt-2 leading-relaxed">
              1992년부터 울산과 함께 달려온<br />울산 대표 시민 마라톤
            </p>
          </div>
          <div>
            <p className="text-caption font-bold text-white/90 mb-3">대회</p>
            <ul className="space-y-2 text-caption">
              <li><Link href="/marathon" className="hover:text-white transition-colors">대회안내</Link></li>
              <li><Link href="/marathon/apply" className="hover:text-white transition-colors">참가신청</Link></li>
              <li><Link href="/marathon/records" className="hover:text-white transition-colors">기록실</Link></li>
              <li><Link href="/marathon/archive" className="hover:text-white transition-colors">지난대회</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-caption font-bold text-white/90 mb-3">참여</p>
            <ul className="space-y-2 text-caption">
              <li><Link href="/marathon/community" className="hover:text-white transition-colors">커뮤니티</Link></li>
              <li><a href="https://iusm.co.kr/my" className="hover:text-white transition-colors">내 신청내역</a></li>
            </ul>
          </div>
          <div>
            <p className="text-caption font-bold text-white/90 mb-3">주최</p>
            <ul className="space-y-2 text-caption">
              <li><a href="https://iusm.co.kr" className="hover:text-white transition-colors">울산매일 ↗</a></li>
              <li>대회 문의 052-243-1001</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-caption text-white/40">
          <p>© {new Date().getFullYear()} 울산매일신문사. All rights reserved.</p>
          <p>주최 (주)울산매일신문사 · 후원 울산광역시</p>
        </div>
      </div>
    </footer>
  );
}
