import { auth } from '@/auth';

interface TossConfirmBody {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const { paymentKey, orderId, amount }: TossConfirmBody = await req.json();

  if (!paymentKey || !orderId || !amount) {
    return Response.json({ message: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
  }

  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ message: '결제 설정 오류' }, { status: 500 });
  }

  const authorization = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;

  const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const payment = await tossRes.json();

  if (!tossRes.ok) {
    return Response.json(
      { message: payment.message ?? '결제 승인에 실패했습니다.' },
      { status: tossRes.status },
    );
  }

  // TODO: DB 연동 후 — 사용자 subscriptionTier 업데이트
  // await updateUserSubscription(session.user.id, deriveTierFromOrderId(orderId));

  return Response.json({ success: true, payment });
}
