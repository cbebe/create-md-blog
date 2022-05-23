#!/usr/bin/env node

import { Option, program } from 'commander';
import { join, resolve } from 'path';
import { CLIPromptOptions, createBlogFile, getAuthors, getSlugsAndTags, promptQuestions } from '../lib';

const BLOG_DIR = './blog';
const AUTHORS_FILE = 'authors.yml';

const pad = (d: { toString: () => string }) => d.toString().padStart(2, '0');
const fmtDate = (date: Date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((d) => pad(d)).join('-');

export async function main() {
  const authorChoices = await getAuthors(resolve(BLOG_DIR, AUTHORS_FILE));
  const fileData = await getSlugsAndTags(BLOG_DIR);

  program
    .option('-s, --standalone', 'Create a standalone file instead of a blog directory')
    .option('--no-standalone')
    .option('--mdx', 'Create MDX file', false)
    .addOption(
      new Option('-a, --author <author entry>', 'Author of the blog post').choices(authorChoices.map(([name]) => name))
    )
    .option('-t, --title <title>', 'Title of the blog')
    .option('--slug <slug>', 'Slug path of the blog file')
    .addOption(new Option('--tags <tags...>', 'Specify tags').choices(Array.from(fileData.tags)))
    .option('-p, --prompt-new-tags', 'Prompt to add new tags', false)
    // This is horrible
    .option('-d, --date <blog date>', 'Date posted for the blog', function (date) {
      if (date === 'now' || date === 'today') return new Date();
      return new Date(date);
    });

  program.parse();

  const options: CLIPromptOptions = program.opts();

  try {
    const response = await promptQuestions(authorChoices, fileData, options);
    const { title, author, date, slug, tags, standalone } = response;
    const path = join(BLOG_DIR, `${fmtDate(date)}-${slug}`);
    const file = await createBlogFile({
      title,
      author,
      path,
      tags,
      standalone,
      mdx: options.mdx,
    });
    if (standalone) {
      process.stdout.write(`Created blog file ${file}\n`);
    } else {
      process.stdout.write(`Created blog directory ${path} and index.${options.mdx ? 'mdx' : 'md'} file\n`);
    }
  } catch (e) {
    process.stderr.write(`${(e as Error).stack as string}\n`);
  }
}

main();
