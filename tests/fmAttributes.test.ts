import fm from 'front-matter';
import { getSlugAndTagsFromFile } from '../src/lib/fmAttributes';

jest.mock('fs/promises');
jest.mock('front-matter');

describe('getSlugsAndTagsFromFile', () => {
  it('should get the slug from the frontmatter', async () => {
    require('fs/promises').__setBehaviour('fm');
    // @ts-expect-error jest types
    fm.mockReturnValue({ attributes: { slug: 'slug', tags: [] } });
    const result = ['slug', []];
    expect(getSlugAndTagsFromFile('2022-05-21-slug.md')).resolves.toStrictEqual(result);
  });

  it('should get the slug from the file', async () => {
    require('fs/promises').__setBehaviour('fm');
    // @ts-expect-error jest types
    fm.mockReturnValue({ attributes: { tags: [] } });
    const result = ['slug', []];
    expect(getSlugAndTagsFromFile('2022-05-21-slug.md')).resolves.toStrictEqual(result);
  });

  it('should get the slug from the directory', async () => {
    require('fs/promises').__setBehaviour('fm');
    // @ts-expect-error jest types
    fm.mockReturnValue({ attributes: { tags: [] } });
    const result = ['slug', []];
    expect(getSlugAndTagsFromFile('2022-05-21-slug/index.md')).resolves.toStrictEqual(result);
  });

  it('should return a null slug on an invalid name', async () => {
    require('fs/promises').__setBehaviour('fm');
    // @ts-expect-error jest types
    fm.mockReturnValue({ attributes: { tags: [] } });
    const result = [null, []];
    expect(getSlugAndTagsFromFile('invalid.md')).resolves.toStrictEqual(result);
  });
  it('should throw an error', async () => {
    require('fs/promises').__setBehaviour('Error');
    expect(getSlugAndTagsFromFile('2022-05-21-.md')).rejects.toThrowError(new Error('A regular error'));
  });
});
