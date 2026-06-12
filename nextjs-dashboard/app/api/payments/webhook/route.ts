export async function POST(req: Request) {
  const body = await req.json();

  // Toss Payments 웹훅 서명 검증
  const webhookSecret = process.env.TOSS_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = req.headers.get('toss-payments-signature');
    if (!signature) {
      return new Response('Unauthorized', { status: 401 });
    }
    // TODO: HMAC-SHA256 서명 검증 로직 추가
  }

  const { eventType, data } = body;

  switch (eventType) {
    case 'PAYMENT_STATUS_CHANGED': {
      const { paymentKey, orderId, status } = data;
      // TODO: DB 연동 후 — 결제 상태에 따른 구독 업데이트
      // if (status === 'CANCELED') await cancelSubscription(orderId);
      console.log('Payment status changed:', { paymentKey, orderId, status });
      break;
    }
    default:
      break;
  }

  return new Response(null, { status: 200 });
}
