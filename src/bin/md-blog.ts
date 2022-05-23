#!/usr/bin/env node

import { resolve } from 'path';
import { getAuthors } from '../lib/authors';
import { getSlugsAndTags } from '../lib/blogData';
import { createBlogFile } from '../lib/index';
import { promptQuestions } from '../lib/questions';

const BLOG_DIR = './blog';
const AUTHORS_FILE = 'authors.yml';

const pad = (d: { toString: () => string }) => d.toString().padStart(2, '0');
const fmtDate = (date: Date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((d) => pad(d)).join('-');

export async function main() {
  try {
    const authorChoices = await getAuthors(resolve(BLOG_DIR, AUTHORS_FILE));
    const fileData = await getSlugsAndTags(BLOG_DIR);
    const response = await promptQuestions(authorChoices, fileData);
    const { title, author, date, slug, tags: existingTags, newTags } = response;
    const tags = Array.from(
      new Set<string>(
        existingTags
          .concat(newTags)
          .filter((t: string) => !!t)
          .map((t: string) => t.toLowerCase())
      )
    );
    await createBlogFile({ title, author, path: `${BLOG_DIR}/${fmtDate(date)}-${slug}`, tags });
  } catch (e) {
    console.error(e);
  }
}

main();
