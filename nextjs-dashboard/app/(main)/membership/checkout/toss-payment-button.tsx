'use client';

import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';
import { useState } from 'react';

interface TossPaymentButtonProps {
  planId: string;
  orderId: string;
  orderName: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  userId: string;
}

// Toss SDK v2의 교집합 overload 타입 문제를 우회하기 위한 최소 타입 정의
type CardPaymentRequest = (params: {
  method: 'CARD';
  amount: { currency: 'KRW'; value: number };
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
  customerEmail?: string;
  customerName?: string;
}) => Promise<void>;

export default function TossPaymentButton({
  orderId,
  orderName,
  amount,
  customerEmail,
  customerName,
  userId,
}: TossPaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    if (!clientKey) {
      alert('결제 설정이 완료되지 않았습니다. 관리자에게 문의해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({
        customerKey: userId || ANONYMOUS,
      });

      await (payment.requestPayment as unknown as CardPaymentRequest)({
        method: 'CARD',
        amount: { currency: 'KRW', value: amount },
        orderId,
        orderName,
        successUrl: `${window.location.origin}/membership/success`,
        failUrl: `${window.location.origin}/membership/fail`,
        customerEmail,
        customerName,
      });
    } catch (err: unknown) {
      const errorCode = (err as { code?: string })?.code;
      if (errorCode !== 'PAY_PROCESS_CANCELED') {
        alert('결제 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full py-4 rounded-xl bg-primary text-white text-body-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? '결제 창 불러오는 중...' : `${amount.toLocaleString()}원 결제하기`}
    </button>
  );
}
