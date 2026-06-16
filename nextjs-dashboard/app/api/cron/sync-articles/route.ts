import { NextResponse } from 'next/server';
import { syncRSS } from '@/app/lib/cms/rss-sync';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: Request) {
  // Vercel Cron은 Authorization: Bearer <CRON_SECRET> 헤더를 자동으로 포함
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const feedUrl = process.env.CMS_RSS_FEED_URL;
  if (!feedUrl) {
    return NextResponse.json(
      { error: 'CMS_RSS_FEED_URL 환경변수가 설정되지 않았습니다' },
      { status: 503 },
    );
  }

  try {
    const result = await syncRSS(feedUrl);
    console.log('[cron/sync-articles]', result);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[cron/sync-articles] error:', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
