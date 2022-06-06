import { createBlogFile } from '../src/lib/blogFile';

jest.mock('fs/promises');

describe('createBlogFile', () => {
  it('should be defined', () => {
    expect(createBlogFile).toBeDefined();
  });

  it('should create a directory with index.md', () => {
    expect(createBlogFile({ path: 'slug', title: 'test', author: 'test' })).resolves.toStrictEqual('slug/index.md');
  });

  it('should create a standalone file with an mdx extension', () => {
    expect(
      createBlogFile({ path: 'slug', title: 'test', author: 'test', mdx: true, standalone: true })
    ).resolves.toStrictEqual('slug.mdx');
  });
});
