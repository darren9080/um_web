import {
  PLACEHOLDER_ARTICLES,
  PLACEHOLDER_EVENTS,
  PLACEHOLDER_MEMBERSHIP_PLANS,
} from './placeholder-data';
import type { Article, Event, ArticleCategory, EventStatus } from './definitions';

export async function fetchFeaturedArticles(): Promise<Article[]> {
  return PLACEHOLDER_ARTICLES.filter((a) => a.featured);
}

export async function fetchLatestArticles(limit = 6): Promise<Article[]> {
  return PLACEHOLDER_ARTICLES.slice(0, limit);
}

export async function fetchArticlesByCategory(
  category: ArticleCategory,
  limit = 10,
): Promise<Article[]> {
  return PLACEHOLDER_ARTICLES.filter((a) => a.category === category).slice(0, limit);
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  return PLACEHOLDER_ARTICLES.find((a) => a.slug === slug) ?? null;
}

export async function fetchUpcomingEvents(limit = 6): Promise<Event[]> {
  return PLACEHOLDER_EVENTS.filter((e) => e.status === 'upcoming').slice(0, limit);
}

export async function fetchEventsByStatus(status: EventStatus): Promise<Event[]> {
  return PLACEHOLDER_EVENTS.filter((e) => e.status === status);
}

export async function fetchEventBySlug(slug: string): Promise<Event | null> {
  return PLACEHOLDER_EVENTS.find((e) => e.slug === slug) ?? null;
}

export async function fetchMembershipPlans() {
  return PLACEHOLDER_MEMBERSHIP_PLANS;
}

export async function fetchHomePageData() {
  const [featuredArticles, latestArticles, upcomingEvents] = await Promise.all([
    fetchFeaturedArticles(),
    fetchLatestArticles(6),
    fetchUpcomingEvents(4),
  ]);
  return { featuredArticles, latestArticles, upcomingEvents };
}
