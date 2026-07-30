export type CmsRole =
  | 'super_admin'
  | 'publisher'
  | 'desk_editor'
  | 'reporter'
  | 'ad_manager'
  | 'event_manager'
  | 'analyst'
  | 'viewer';

export type CmsPermission =
  | 'articles.create'
  | 'articles.update'
  | 'articles.correct'
  | 'articles.publish'
  | 'articles.ai'
  | 'banners.manage'
  | 'events.manage'
  | 'homepage.manage'
  | 'desk.online'
  | 'desk.print'
  | 'desk.video'
  | 'calendar.manage'
  | 'analytics.view'
  | 'roles.manage'
  | 'audit.view';

export type ArticleStatus =
  | 'draft'
  | 'copyediting'
  | 'desk_review'
  | 'scheduled'
  | 'published'
  | 'archived';

export type DeskType = 'online' | 'print' | 'video';

export type Article = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  section: string;
  desk: DeskType;
  status: ArticleStatus;
  author: string;
  editor?: string;
  sourceReleaseTitle?: string;
  similarityScore?: number;
  seoKeywords: string[];
  views: number;
  likes: number;
  readDepth: number;
  reporterAwarenessScore: number;
  scheduledAt?: string;
  publishedAt?: string;
  updatedAt: string;
  heroImage?: string;
};

export type Banner = {
  id: string;
  title: string;
  placement: 'top' | 'main' | 'sidebar' | 'article_inline';
  imageUrl: string;
  linkUrl: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  sortOrder: number;
  ownerRole: CmsRole;
};

export type EditorialEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  isPublished: boolean;
  calendarSynced: boolean;
};

export type HomepageSlot = {
  id: string;
  section: 'lead' | 'top_grid' | 'latest' | 'opinion' | 'feature';
  label: string;
  articleId: string;
  articleTitle: string;
  position: number;
  isVisible: boolean;
};

export type DeskQueueItem = {
  id: string;
  desk: DeskType;
  title: string;
  owner: string;
  status: ArticleStatus;
  deadline: string;
  priority: 'urgent' | 'high' | 'normal';
};

export type CalendarItem = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  owner: string;
  type: 'coverage' | 'interview' | 'deadline' | 'meeting';
  googleEventId?: string;
};

export type ReporterMetric = {
  reporter: string;
  beat: string;
  articles: number;
  views: number;
  likes: number;
  avgReadDepth: number;
  awarenessScore: number;
};

export type FeatureDecision = 'build' | 'phase_2' | 'phase_3' | 'hold';

export type CmsFeature = {
  id: string;
  title: string;
  area: string;
  decision: FeatureDecision;
  priority: 'MVP' | 'Phase 2' | 'Phase 3';
  rationale: string;
};
