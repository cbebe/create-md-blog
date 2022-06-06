# Create Markdown Blog

Create a markdown blog file using the CLI

<img src="https://img.shields.io/npm/v/create-md-blog.svg" alt="NPM Version" />
<img src="https://img.shields.io/npm/l/create-md-blog.svg" alt="Package License" />
<img src="https://img.shields.io/npm/dm/create-md-blog.svg" alt="NPM Downloads" />
<a href='https://coveralls.io/github/cbebe/create-md-blog?branch=master'><img src='https://coveralls.io/repos/github/cbebe/create-md-blog/badge.svg?branch=master' alt='Coverage Status' /></a>

## Install

To use once:

```
npx create-md-blog
```

To use as a dev dependency on a particular project:

```
npm install --save-dev create-md-blog
npm md-blog
```

Install globally:

```
npm install --global create-md-blog
md-blog
```

## Command Line Options

```
Usage: md-blog [options]

Options:
  -s, --standalone             Create a standalone file instead of a blog
                               directory
  --no-standalone
  --mdx                        Create MDX file (default: false)
  -a, --author <author entry>  Author of the blog post
  -t, --title <title>          Title of the blog
  --slug <slug>                Slug path of the blog file
  --tags <tags...>             Specify existing tags
  -p, --prompt-new-tags        Prompt to add new tags (default: false)
  -d, --date <blog date>       Date posted for the blog
  -h, --help                   display help for command
```

Any unspecified options will be prompted:

```
✔ Create a standalone file?
(Yes if you're not including other files like images) › no
✔ Who is creating this blog? › charles
✔ Title of the blog … Example blog
✔ URL slug for the blog … example-blog
✔ Pick existing tags › nice
✔ Date of blog › May 23 2022
Created blog directory blog/2022-05-23-example-blog and index.md file
```
