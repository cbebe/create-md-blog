import fm from 'front-matter';
import { readFile } from 'fs/promises';
import type { BlogAttributes } from './types';

function getFileSlug(fileName: string) {
  const fileSlug = fileName.match(/.*\d{4}-\d{2}-\d{2}-(.*?)(\/index)?.mdx?/);
  return fileSlug?.[1] || null;
}

export async function getSlugAndTagsFromFile(fileName: string): Promise<[string | null, string | string[]]> {
  const { attributes } = fm<BlogAttributes>((await readFile(fileName)).toString());
  return [attributes.slug || getFileSlug(fileName), attributes.tags];
}
