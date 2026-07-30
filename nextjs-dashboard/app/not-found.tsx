import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
};

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '2rem' }}>
      <p style={{ fontSize: '6rem', fontWeight: 900, color: '#F5F5F5', lineHeight: 1, userSelect: 'none', margin: 0 }}>404</p>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', marginTop: '-1rem', marginBottom: '0.5rem' }}>
        페이지를 찾을 수 없습니다
      </h1>
      <p style={{ color: '#737373', fontSize: '0.875rem', maxWidth: '24rem', margin: '0 0 1.5rem' }}>
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link href="/" style={{ background: '#231F20', color: '#fff', padding: '0.625rem 1.5rem', borderRadius: '0.75rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
        홈으로 돌아가기
      </Link>
    </div>
  );
}
