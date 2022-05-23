import { readFile } from 'fs/promises';
import { load } from 'js-yaml';

export interface Author {
  name: string;
  title: string;
  url: string;
  image_url: string;
}

export type AuthorChoices = [string, Author][];

export async function getAuthors(filePath: string): Promise<AuthorChoices> {
  try {
    const doc = load(await readFile(filePath, 'utf8'));
    return Object.entries(doc as object);
  } catch (err) {
    const typedErr = err as NodeJS.ErrnoException;
    if (typedErr.errno === -2) throw new Error('Authors configuration file does not exist');
    throw err;
  }
}
