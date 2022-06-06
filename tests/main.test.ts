import { main } from '../src/bin/main';
import { getSlugsAndTags, promptQuestions } from '../src/lib';

jest.mock('commander', () => {
  const actualModule = jest.requireActual('commander');
  const mockModule = {
    __esModule: true,
    ...actualModule,
  };
  mockModule.program.parse = () => Promise.resolve();
  mockModule.program.opts = jest
    .fn()
    .mockReturnValueOnce({ mdx: false })
    .mockReturnValueOnce({ mdx: true })
    .mockReturnValueOnce({ mdx: false });
  return mockModule;
});

jest.mock('../src/lib/blogData');
jest.mock('../src/lib/blogFile');
jest.mock('../src/lib/questions');

describe('main', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(main).toBeDefined();
  });

  it('should create a standalone file', async () => {
    // @ts-expect-error jest types
    getSlugsAndTags.mockResolvedValue({ slugs: new Set(), tags: new Set(['hi']) });
    // @ts-expect-error jest types
    promptQuestions.mockResolvedValue({
      title: 'Test',
      author: 'test',
      date: new Date(),
      slug: 'test',
      tags: ['test'],
      standalone: true,
    });
    await main();
  });

  it('should create a blog directory with mdx', async () => {
    // @ts-expect-error jest types
    getSlugsAndTags.mockResolvedValue({ slugs: new Set(), tags: new Set(['hi']) });
    // @ts-expect-error jest types
    promptQuestions.mockResolvedValue({
      title: 'Test',
      author: 'test',
      date: new Date(),
      slug: 'test',
      tags: ['test'],
      standalone: false,
    });
    await main();
  });

  it('should create a blog directory with md', async () => {
    // @ts-expect-error jest types
    getSlugsAndTags.mockResolvedValue({ slugs: new Set(), tags: new Set(['hi']) });
    // @ts-expect-error jest types
    promptQuestions.mockResolvedValue({
      title: 'Test',
      author: 'test',
      date: new Date(),
      slug: 'test',
      tags: ['test'],
      standalone: false,
    });
    await main();
  });
});
