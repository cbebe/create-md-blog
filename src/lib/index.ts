import { mkdir, writeFile } from 'fs/promises';
import yaml from 'js-yaml';

const createBlogDir = async (blogDir: string) => {
  await mkdir(blogDir, { recursive: true });
  return blogDir;
};

export interface CreateBlogOptions {
  title: string;
  author: string;
  tags?: string[];
  path: string;
  standalone?: boolean;
}

export async function createBlogFile(opts: CreateBlogOptions) {
  const { title, author: authors, tags, path, standalone = false } = opts;

  const frontMatter = `---\n${yaml.dump({ title, authors, tags }, { flowLevel: 1 })}---\n\n<!--truncate-->\n`;

  if (standalone) {
    await writeFile(path + '.md', frontMatter);
  } else {
    await createBlogDir(path);
    await writeFile(path + '/index.md', frontMatter);
  }
}
