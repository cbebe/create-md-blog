#!/usr/bin/env node

import { mkdir, writeFile } from 'fs/promises';
import yaml from 'js-yaml';
import { resolve } from 'path';
import { getAuthors } from './authors';
import { getSlugsAndTags } from './blogData';
import { promptQuestions } from './questions';

const BLOG_DIR = './blog';

const pad = (d: { toString: () => string }) => d.toString().padStart(2, '0');
const fmtDate = (date: Date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((d) => pad(d)).join('-');

const createBlogDir = async (date: Date, slug: string) => {
  const blogDir = `${BLOG_DIR}/${fmtDate(date)}-${slug}`;
  await mkdir(blogDir, { recursive: true });
  return blogDir;
};

async function main() {
  try {
    const authorChoices = await getAuthors(resolve(BLOG_DIR, 'authors.yml'));
    const fileData = await getSlugsAndTags(BLOG_DIR);
    const response = await promptQuestions(authorChoices, fileData);
    const { date, slug, tags: existingTags, newTags, ...rest } = response;
    const dirName = await createBlogDir(date, slug);
    const tags = Array.from(
      new Set(
        existingTags
          .concat(newTags)
          .filter((t: string) => !!t)
          .map((t: string) => t.toLowerCase())
      )
    );
    const { title, author: authors } = rest;
    const frontMatter = `---\n${yaml.dump({ title, authors, tags }, { flowLevel: 1 })}---\n\n<!--truncate-->\n`;

    await writeFile(dirName + '/index.md', frontMatter);
  } catch (e) {
    console.error(e);
  }
}

main();
