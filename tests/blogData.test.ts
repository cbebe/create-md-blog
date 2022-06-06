import readdirp from 'readdirp';
import { getSlugsAndTags } from '../src/lib/blogData';

jest.mock('fs/promises');
jest.mock('readdirp');

describe('getSlugsAndTags', () => {
  it('should be defined', () => {
    expect(getSlugsAndTags).toBeDefined();
  });
  it('should read files', async () => {
    require('fs/promises').__setBehaviour('fm');
    // @ts-expect-error jest types
    readdirp.promise.mockResolvedValue?.([{ fullPath: 'path' }]);
    const result = {
      slugs: new Set(['til/my-actual-height']),
      tags: new Set(['til']),
    };

    expect(getSlugsAndTags('dir')).resolves.toStrictEqual(result);
  });
  it('should throw an error', async () => {
    require('fs/promises').__setBehaviour('Error');
    // @ts-expect-error jest types
    readdirp.promise.mockResolvedValue?.([{ fullPath: 'path' }]);
    expect(getSlugsAndTags('dir')).rejects.toThrowError(new Error('A regular error'));
  });
});
