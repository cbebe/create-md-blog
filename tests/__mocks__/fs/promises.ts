type Behaviour = 'Error' | 'NotFound' | 'authors';

interface Promises {
  __setBehaviour(b: Behaviour): void;
  readFile(file: string): Promise<string>;
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

let behaviour: Behaviour;

promises.__setBehaviour = function __setBehaviour(b: Behaviour) {
  behaviour = b;
};

promises.readFile = async function readFile(_: string) {
  if (behaviour === 'Error') {
    throw new Error('A regular error');
  } else if (behaviour === 'NotFound') {
    throw { errno: -2 };
  } else {
    return authors;
  }
};
module.exports = promises;
