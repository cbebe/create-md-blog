#!/usr/bin/env node

import fm from 'front-matter';
import { readFile } from 'fs/promises';
import readdirp from 'readdirp';

export type BlogData = { slugs: Set<string>; tags: Set<string> };

type BlogAttributes = { slug: string; tags: string | string[] };

function getFileSlug(fileName: string) {
  const fileSlug = fileName.match(/.*\d{4}-\d{2}-\d{2}-(.*?)(\/index)?.mdx?/);
  return fileSlug ? fileSlug[1] : null;
}

async function getSlugAndTagsFromFile(fileName: string): Promise<[string | null, string | string[]]> {
  const { attributes } = fm<BlogAttributes>((await readFile(fileName)).toString());
  return [attributes.slug ? attributes.slug : getFileSlug(fileName), attributes.tags];
}

function getAllMarkdownFiles(dir: string): Promise<string[]> {
  return new Promise<string[]>((resolve) => {
    const allFilePaths: string[] = [];
    readdirp(dir, { fileFilter: ['*.md', '*.mdx'] })
      .on('data', function (entry) {
        allFilePaths.push(entry.fullPath);
      })
      .on('warn', function (warn) {
        process.stderr.write('readdirp Warn: ' + warn);
      })
      .on('error', function (err) {
        process.stderr.write('readdirp Error: ' + err.stack);
      })
      .on('end', function () {
        resolve(allFilePaths);
      });
  });
}

export async function getSlugsAndTags(blogDir: string): Promise<BlogData> {
  const allFiles = await getAllMarkdownFiles(blogDir);
  const entries = await Promise.all(allFiles.map((f) => getSlugAndTagsFromFile(f)));
  return {
    slugs: new Set(entries.map(([slug]) => slug).filter((slug) => !!slug)) as Set<string>,
    tags: new Set(entries.flatMap(([, tags]) => tags)),
  };
}
