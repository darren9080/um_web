import { createHmac, timingSafeEqual } from 'crypto';

function verifyTossSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const expected = hmac.digest('hex');
  try {
    return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  const webhookSecret = process.env.TOSS_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = req.headers.get('toss-payments-signature');
    if (!signature || !verifyTossSignature(rawBody, signature, webhookSecret)) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  let body: { eventType?: string; data?: Record<string, unknown> };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const { eventType, data } = body;

  switch (eventType) {
    case 'PAYMENT_STATUS_CHANGED': {
      const { paymentKey, orderId, status } = data as {
        paymentKey: string;
        orderId: string;
        status: string;
      };
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
