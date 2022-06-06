import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import type { AuthorChoices } from './types';

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
