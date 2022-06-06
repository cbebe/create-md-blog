import prompts, { PromptObject } from 'prompts';
import { promptQuestions } from '../src/lib/questions';
import { PromptResponse } from '../src/lib/types';

jest.mock('prompts');

describe('promptQuestions', () => {
  it('should be defined', () => {
    expect(promptQuestions).toBeDefined();
  });

  it('should prompt for answers', () => {
    // @ts-expect-error jest types
    prompts.mockResolvedValue({ newTags: [] });
    expect(
      promptQuestions(
        [['hi', { name: 'hi', image_url: '', title: '', url: '' }]],
        { slugs: new Set(), tags: new Set(['hi']) },
        {}
      )
    ).resolves.toBeTruthy();
  });

  it('should not prompt to use existing tags', () => {
    // @ts-expect-error jest types
    prompts.mockResolvedValue({ newTags: [] });
    expect(promptQuestions([], { slugs: new Set(), tags: new Set() }, {})).resolves.toBeTruthy();
  });

  it('should add to existing tags', () => {
    // @ts-expect-error jest types
    prompts.mockResolvedValue({ newTags: [] });
    expect(promptQuestions([], { slugs: new Set(), tags: new Set() }, {})).resolves.toBeTruthy();
  });

  it('should prompt for new tags', () => {
    // @ts-expect-error jest types
    prompts.mockResolvedValue({ newTags: [] });
    expect(promptQuestions([], { slugs: new Set(), tags: new Set() }, { promptNewTags: true })).resolves.toBeTruthy();
  });

  it('should throw an error if slug already exists', () => {
    // @ts-expect-error jest types
    prompts.mockResolvedValue({ newTags: [] });
    expect(promptQuestions([], { slugs: new Set(['hi']), tags: new Set() }, { slug: 'hi' })).rejects.toThrowError(
      new Error('Slug `hi` already exists in blog')
    );
  });

  it('should exit when the prompt is cancelled', () => {
    // @ts-expect-error jest types
    prompts.mockImplementation(async (questions: Array<PromptObject<keyof PromptResponse>>, { onCancel }) => {
      onCancel();
      const [, , title, slug, , promptNewTags] = questions;
      // @ts-expect-error empty params
      title.validate?.('hi', {}, {});
      // @ts-expect-error empty params
      title.validate?.('', {}, {});
      // @ts-expect-error empty params
      slug.validate?.('hi', {}, {});
      // @ts-expect-error empty params
      slug.initial?.('', { title: 'hi' }, {});
      // @ts-expect-error empty params
      promptNewTags.format?.(['hi'], {}, {});
      return { newTags: ['dang', 'bro'] };
    });
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => ({} as never));
    expect(
      promptQuestions([], { slugs: new Set(), tags: new Set(['hi']) }, { promptNewTags: true })
    ).resolves.toBeTruthy();
    expect(mockExit).toHaveBeenCalledWith(0);
  });
  it('should validate when slug already exists in the blog', () => {
    // @ts-expect-error jest types
    prompts.mockImplementation(async (questions: Array<PromptObject<keyof PromptResponse>>) => {
      const slug = questions[2];
      // @ts-expect-error empty params
      expect(slug.validate?.('hi', {}, {})).toStrictEqual('Slug `hi` already exists in blog');
      // @ts-expect-error initial is expected to be a string
      expect(slug.initial?.('hi', {}, {})).toStrictEqual('hi');
      return { newTags: ['dang', 'bro'] };
    });
    expect(
      promptQuestions([], { slugs: new Set(['hi']), tags: new Set(['hi']) }, { title: 'hi' })
    ).resolves.toBeTruthy();
  });
});
