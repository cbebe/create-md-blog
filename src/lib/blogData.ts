import { promise } from 'readdirp';
import { getSlugAndTagsFromFile } from './fmAttributes';
import type { BlogData } from './types';

async function getAllMarkdownFiles(dir: string): Promise<string[]> {
  return (await promise(dir, { fileFilter: ['*.md', '*.mdx'] })).map((e) => e.fullPath);
}

export async function getSlugsAndTags(blogDir: string): Promise<BlogData> {
  const allFiles = await getAllMarkdownFiles(blogDir);
  const entries = await Promise.all(allFiles.map((f) => getSlugAndTagsFromFile(f)));
  return {
    slugs: new Set(entries.map(([slug]) => slug).filter((slug) => !!slug)) as Set<string>,
    tags: new Set(entries.flatMap(([, tags]) => tags)),
  };
}
