import { mkdir, writeFile } from 'fs/promises';
import yaml from 'js-yaml';
import type { CreateBlogOptions } from './types';

async function createBlogDir(blogDir: string) {
  await mkdir(blogDir, { recursive: true });
  return blogDir;
}

export async function createBlogFile(opts: CreateBlogOptions) {
  const { title, author: authors, tags, path, standalone = false, mdx = false } = opts;

  const frontMatter = `---\n${yaml.dump({ title, authors, tags }, { flowLevel: 1 })}---\n\n<!--truncate-->\n`;

  const ext = mdx ? '.mdx' : '.md';
  const filePath = standalone ? `${path}${ext}` : `${path}/index${ext}`;

  if (!standalone) await createBlogDir(path);

  await writeFile(filePath, frontMatter);
  return filePath;
}
