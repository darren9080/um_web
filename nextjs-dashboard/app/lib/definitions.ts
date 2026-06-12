export type ArticleCategory =
  | 'society'
  | 'culture'
  | 'humanities'
  | 'sports'
  | 'startup'
  | 'business';

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  society: '사회',
  culture: '문화',
  humanities: '인문학',
  sports: '스포츠',
  startup: '스타트업',
  business: '비즈니스',
};

export const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  society: 'bg-red-50 text-red-700',
  culture: 'bg-purple-50 text-purple-700',
  humanities: 'bg-indigo-50 text-indigo-700',
  sports: 'bg-orange-50 text-orange-700',
  startup: 'bg-green-50 text-green-700',
  business: 'bg-blue-50 text-blue-700',
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: ArticleCategory;
  author: string;
  authorAvatar?: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  featured: boolean;
  premium: boolean;
};

export type EventStatus = 'upcoming' | 'ongoing' | 'ended';
export type EventType =
  | 'festival'
  | 'marathon'
  | 'award'
  | 'fair'
  | 'golf'
  | 'academy'
  | 'seminar'
  | 'exhibition';

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  festival: '페스티벌',
  marathon: '마라톤',
  award: '시상식',
  fair: '박람회',
  golf: '골프대회',
  academy: '아카데미',
  seminar: '세미나',
  exhibition: '전시회',
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  heroImage?: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  price: number | null;
  maxCapacity: number | null;
  currentRegistrations: number;
  tags: string[];
  featured: boolean;
  registrationDeadline?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'naver' | 'kakao' | 'email';
  subscriptionTier: 'free' | 'individual' | 'corporate';
  createdAt: string;
};

export type Comment = {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  parentId?: string;
  likes: number;
};

export type MembershipPlan = {
  id: string;
  name: string;
  tier: 'individual' | 'corporate';
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  highlighted: boolean;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  active: boolean;
};

export type SponsorBanner = {
  id: string;
  imageUrl: string;
  linkUrl: string;
  altText: string;
  position: 'header' | 'sidebar' | 'content' | 'footer';
  size: 'leaderboard' | 'rectangle' | 'mobile-banner';
};
