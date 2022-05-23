export type CLIPromptOptions = Partial<{
  standalone: boolean;
  author: string;
  title: string;
  slug: string;
  tags: string;
  promptNewTags: boolean;
  date: Date;
  mdx: boolean;
}>;

export interface PromptResponse {
  standalone: boolean;
  author: string;
  title: string;
  slug: string;
  tags: string[];
  newTags: string | string[];
  date: Date;
}

export type BlogData = { slugs: Set<string>; tags: Set<string> };

export type BlogAttributes = { slug: string; tags: string | string[] };

export interface Author {
  name: string;
  title: string;
  url: string;
  image_url: string;
}

export type AuthorChoices = [string, Author][];

export interface CreateBlogOptions {
  title: string;
  author: string;
  tags?: string[];
  path: string;
  standalone?: boolean;
  mdx?: boolean;
}
