import type { CollectionEntry } from 'astro:content';

export function getAllTags(posts: CollectionEntry<'blog'>[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.data.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function getPostsByTag(
  posts: CollectionEntry<'blog'>[],
  tag: string,
): CollectionEntry<'blog'>[] {
  return posts
    .filter((post) => post.data.tags?.includes(tag))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getTagCounts(
  posts: CollectionEntry<'blog'>[],
): Map<string, number> {
  const counts = new Map<string, number>();
  posts.forEach((post) => {
    post.data.tags?.forEach((tag) => {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    });
  });
  return counts;
}
