import prompts from 'prompts';
import { AuthorChoices } from './authors';
import { BlogData } from './blogData';

export function promptQuestions(authorChoices: AuthorChoices, fileData: BlogData) {
  const { slugs, tags } = fileData;
  return prompts(
    [
      {
        type: 'select',
        name: 'author',
        message: 'Who is creating this blog?',
        choices: authorChoices.map(([name]) => ({ title: name, value: name })),
      },
      {
        type: 'text',
        name: 'title',
        message: 'Title of the blog',
        validate: (title) => (!title.length ? 'Please enter a title' : true),
      },
      {
        type: 'text',
        name: 'slug',
        message: 'URL slug for the blog',
        validate: (slug) => (slugs.has(slug) ? 'Slug already exists in blog' : true),
        initial: (prev) =>
          prev
            .split(' ')
            .slice(0, 2)
            .map((s: string) => s.toLowerCase())
            .join('-'),
      },
      {
        type: 'autocompleteMultiselect',
        name: 'tags',
        message: 'Pick existing tags',
        choices: Array.from(tags).map((t) => ({ title: t, value: t })),
      },
      {
        type: 'list',
        name: 'newTags',
        format: (val) => val.map((v: string) => v.toString()),
        message: 'List new tags (separated by commas)',
      },
      {
        type: 'date',
        name: 'date',
        message: 'Date of blog',
        mask: 'MMM DD YYYY',
        initial: new Date(),
      },
    ],
    {
      onCancel: () => {
        process.exit(0);
      },
    }
  );
}
