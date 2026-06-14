import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { JOURNALISTS } from '@/app/lib/journalists-data';
import { SITE_URL, SITE_NAME } from '@/app/lib/site-config';

export const metadata: Metadata = {
  title: '기자 소개',
  description: `${SITE_NAME} 기자들을 소개합니다. 울산의 사회·문화·스포츠·경제를 현장에서 취재하는 전문 기자진입니다.`,
  alternates: { canonical: `${SITE_URL}/journalists` },
  openGraph: {
    title: `기자 소개 | ${SITE_NAME}`,
    description: '울산을 취재하는 전문 기자진을 만나보세요.',
    url: `${SITE_URL}/journalists`,
  },
};

export default function JournalistsPage() {
  return (
    <div className="container-main py-10 lg:py-16">
      {/* 헤더 */}
      <div className="max-w-2xl mb-12">
        <p className="text-caption font-semibold tracking-widest text-accent uppercase mb-2">Our Team</p>
        <h1 className="text-heading-1 font-bold text-neutral-900 mb-4">기자 소개</h1>
        <p className="text-body text-neutral-600 leading-relaxed">
          울산매일UTV의 기자들은 현장에서 직접 발로 뛰며 울산의 사회·문화·스포츠·경제 이야기를 전달합니다.
          각 분야 전문 기자들의 프로필과 담당 영역을 확인하세요.
        </p>
      </div>

      {/* 기자 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {JOURNALISTS.map((journalist) => (
          <Link
            key={journalist.id}
            href={`/journalists/${journalist.slug}`}
            className="group flex flex-col"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 mb-4">
              <Image
                src={journalist.photo}
                alt={journalist.name}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-caption font-semibold text-white/80 mb-0.5">{journalist.department}</p>
                <h2 className="text-white font-bold text-xl">{journalist.name}</h2>
                <p className="text-white/70 text-caption mt-0.5">{journalist.title}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {journalist.beats.slice(0, 3).map((beat) => (
                <span
                  key={beat}
                  className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-caption font-medium rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                >
                  {beat}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
