'use client';

import { useEffect, useState } from 'react';

interface Props {
  postId: string;
  initialLikes: number;
}

// 커뮤니티 게시글 추천은 아직 서버 API가 없는 플레이스홀더 데이터 단계라
// (marathon-data.ts의 정적 likes 값), 브라우저 로컬에만 상태를 남긴다.
// 실제 계정 연동 추천 집계는 댓글 시스템과 함께 백엔드 연동 시 처리 예정.
function storageKey(postId: string) {
  return `marathon-liked-${postId}`;
}

export default function LikeButton({ postId, initialLikes }: Props) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  useEffect(() => {
    const alreadyLiked = localStorage.getItem(storageKey(postId)) === '1';
    setLiked(alreadyLiked);
    if (alreadyLiked) {
      setLikes(initialLikes + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  function toggleLike() {
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    if (next) {
      localStorage.setItem(storageKey(postId), '1');
    } else {
      localStorage.removeItem(storageKey(postId));
    }
  }

  return (
    <button
      onClick={toggleLike}
      aria-pressed={liked}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-bold transition-colors ${
        liked
          ? 'bg-brand-red border-brand-red text-white'
          : 'border-brand-red text-brand-red hover:bg-brand-red hover:text-white'
      }`}
    >
      👍 추천 {likes}
    </button>
  );
}
