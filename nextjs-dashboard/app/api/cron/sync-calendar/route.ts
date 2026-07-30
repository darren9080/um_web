import { NextResponse } from 'next/server';
import { syncGoogleCalendar } from '@/app/lib/cms/calendar-sync';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: Request) {
  // Vercel Cron은 Authorization: Bearer <CRON_SECRET> 헤더를 자동으로 포함
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.GOOGLE_CALENDAR_ID) {
    return NextResponse.json(
      { error: 'GOOGLE_SERVICE_ACCOUNT_KEY 또는 GOOGLE_CALENDAR_ID 환경변수가 설정되지 않았습니다' },
      { status: 503 },
    );
  }

  try {
    const result = await syncGoogleCalendar();
    console.log('[cron/sync-calendar]', result);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[cron/sync-calendar] error:', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
