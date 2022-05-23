#!/usr/bin/env node

import fm from 'front-matter';
import { readdir, readFile } from 'fs/promises';
import { basename, extname, resolve } from 'path';

export type BlogData = { slugs: Set<string>; tags: Set<string> };

type BlogAttributes = { slug: string; tags: string | string[] };

function getFileSlug(fileName: string) {
  const fileSlug = fileName.match(/\d{4}-\d{2}-\d{2}-(.*).md/);
  return fileSlug ? fileSlug[1] : null;
}

async function getSlugAndTagsFromFile(fileName: string): Promise<[string | null, string | string[]]> {
  const { attributes } = fm<BlogAttributes>((await readFile(fileName)).toString());
  return [attributes.slug ? attributes.slug : getFileSlug(basename(fileName)), attributes.tags];
}

export async function getSlugsAndTags(blogDir: string): Promise<BlogData> {
  const entries = await Promise.all(
    (await readdir(blogDir)).filter((f) => extname(f) === 'md').map((f) => getSlugAndTagsFromFile(resolve(blogDir, f)))
  );

  return {
    slugs: new Set(entries.map(([slug]) => slug).filter((slug) => !!slug)) as Set<string>,
    tags: new Set(entries.flatMap(([, tags]) => tags)),
  };
}
