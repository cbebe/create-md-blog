import { constants } from 'os';

type Behaviour = 'Error' | 'NotFound' | 'authors' | 'fm';

interface Promises {
  __setBehaviour(b: Behaviour): void;
  readFile(file: string): Promise<string>;
  writeFile(file: string, contents: string): Promise<void>;
  mkdir(dir: string): Promise<void>;
}

const promises: Promises = jest.createMockFromModule('fs/promises');

const authors = `\
author1:
  name: First Author
  title: An Author
  url: https://github.com/author1
  image_url: https://github.com/author1.png
author2:
  name: Second Author
  title: Another Author
  url: https://github.com/author2
  image_url: https://github.com/author2.png
`;

const frontmatter = `\
---
title: "TIL: My actual height"
slug: til/my-actual-height
authors: cbebe
tags: [til]
---

Today I learned what my actual height was (at least at the time of writing). For a few years now I've always kind of just stuck with 170 cm because that's what was in my driver's license when I got it 5 years ago (I really need to pass the road test this year). I'm not even sure if that was right at the time.
`;

let behaviour: Behaviour;

promises.__setBehaviour = function __setBehaviour(b: Behaviour) {
  behaviour = b;
};

promises.readFile = async function readFile(/* file: string */) {
  if (behaviour === 'Error') {
    throw new Error('A regular error');
  } else if (behaviour === 'NotFound') {
    throw { errno: -constants.errno.ENOENT };
  } else if (behaviour === 'authors') {
    return authors;
  } else if (behaviour === 'fm') {
    return frontmatter;
  }

  throw new Error('behaviour not defined');
};

promises.writeFile = async function writeFile() {
  //
};

promises.mkdir = async function mkdir() {
  //
};

module.exports = promises;
