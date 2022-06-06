import prompts, { PromptObject } from 'prompts';
import slugify from 'slug';
import { AuthorChoices, BlogData, CLIPromptOptions, PromptResponse } from './types';

export async function promptQuestions(
  authorChoices: AuthorChoices,
  fileData: BlogData,
  options: CLIPromptOptions
): Promise<Omit<PromptResponse, 'newTags'>> {
  const { slugs, tags: fileDataTags } = fileData;
  const { author, date, promptNewTags, slug, standalone, tags, title } = options;
  const questions: Array<PromptObject<keyof PromptResponse>> = [];
  if (standalone === undefined) {
    questions.push({
      type: 'select',
      name: 'standalone',
      message: "Create a standalone file?\n(Yes if you're not including other files like images)",
      choices: [
        { title: 'yes', value: true },
        { title: 'no', value: false },
      ],
      initial: false,
    });
  }

  if (author === undefined) {
    questions.push({
      type: 'select',
      name: 'author',
      message: 'Who is creating this blog?',
      choices: authorChoices.map(([name]) => ({ title: name, value: name })),
    });
  }

  if (title === undefined) {
    questions.push({
      type: 'text',
      name: 'title',
      message: 'Title of the blog',
      validate: (title) => (!title.length ? 'Please enter a title' : true),
    });
  }

  if (slug === undefined) {
    questions.push({
      type: 'text',
      name: 'slug',
      message: 'URL slug for the blog',
      validate: (slug) => (slugs.has(slug) ? `Slug \`${slug}\` already exists in blog` : true),
      initial: (_, values) => slugify(values.title || options.title),
    });
  } else if (slugs.has(slug)) {
    throw new Error(`Slug \`${slug}\` already exists in blog`);
  }

  if (tags === undefined && fileDataTags.size) {
    questions.push({
      type: 'autocompleteMultiselect',
      name: 'tags',
      message: 'Pick existing tags',
      choices: Array.from(fileDataTags).map((t) => ({ title: t, value: t })),
    });
  }

  if (promptNewTags) {
    questions.push({
      type: 'list',
      name: 'newTags',
      format: (val) => val.map((v: string) => v.toString()),
      message: 'List new tags (separated by commas)',
    });
  }

  if (date === undefined) {
    questions.push({
      type: 'date',
      name: 'date',
      message: 'Date of blog',
      mask: 'MMM DD YYYY',
      initial: new Date(),
    });
  }

  const givenOptions = { author, title, date, slug, standalone };
  const {
    newTags,
    tags: existingTags = [],
    ...rest
  } = (await prompts(questions, { onCancel: () => process.exit(0) })) as PromptResponse;
  const combinedTags = Array.from(
    new Set<string>(
      (tags || existingTags)
        .concat(newTags)
        .filter((t) => !!t)
        .map((t) => t.toLowerCase())
    )
  );

  return {
    ...givenOptions,
    tags: combinedTags,
    ...rest,
  };
}
