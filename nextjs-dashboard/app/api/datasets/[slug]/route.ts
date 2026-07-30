import { NextResponse } from 'next/server';
import { getDatasetBySlug, DATASETS } from '@/app/lib/datasets-data';
import { SITE_URL, SITE_NAME } from '@/app/lib/site-config';

export const dynamic = 'force-static';
export const revalidate = 3600; // 1시간 캐시

type Params = Promise<{ slug: string }>;

export async function GET(
  _request: Request,
  { params }: { params: Params },
) {
  const { slug } = await params;
  const dataset = getDatasetBySlug(slug);

  if (!dataset) {
    return NextResponse.json({ error: '데이터셋을 찾을 수 없습니다' }, { status: 404 });
  }

  const responseData = {
    meta: {
      slug: dataset.slug,
      name: dataset.name,
      domain: dataset.domain,
      unit: dataset.unit,
      updateCycle: dataset.updateCycle,
      referenceDate: dataset.referenceDate,
      isProvisional: dataset.isProvisional,
      sourceName: dataset.sourceName,
      sourceUrl: dataset.sourceUrl,
      methodNote: dataset.methodNote,
      description: dataset.description,
      pageUrl: `${SITE_URL}/data/${dataset.slug}`,
      publisher: { name: SITE_NAME, url: SITE_URL },
      generatedAt: new Date().toISOString(),
    },
    data: dataset.points,
  };

  return NextResponse.json(responseData, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// 정적 경로 사전 생성
export function generateStaticParams() {
  return DATASETS.map((d) => ({ slug: d.slug }));
}
