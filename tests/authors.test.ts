import { getAuthors } from '../src/lib/authors';

jest.mock('fs/promises');

export const authors = [
  [
    'author1',
    {
      name: 'First Author',
      title: 'An Author',
      url: 'https://github.com/author1',
      image_url: 'https://github.com/author1.png',
    },
  ],
  [
    'author2',
    {
      name: 'Second Author',
      title: 'Another Author',
      url: 'https://github.com/author2',
      image_url: 'https://github.com/author2.png',
    },
  ],
];

describe('getAuthors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(getAuthors).toBeDefined();
  });

  it('should get a list of authors with their ID', async () => {
    require('fs/promises').__setBehaviour('authors');
    expect(getAuthors('authors.yml')).resolves.toStrictEqual(authors);
  });

  it('should throw a regular error', async () => {
    require('fs/promises').__setBehaviour('Error');
    expect(getAuthors('authors.yml')).rejects.toThrowError(new Error('A regular error'));
  });

  it('should throw a file not found error', async () => {
    require('fs/promises').__setBehaviour('NotFound');
    expect(getAuthors('authors.yml')).rejects.toThrowError(new Error('Authors configuration file does not exist'));
  });
});
