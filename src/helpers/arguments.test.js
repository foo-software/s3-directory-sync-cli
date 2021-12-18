import { getArgument, convertOptionsFromArguments } from './arguments';

describe('getArgument', () => {
  const ARGV = process.argv;

  beforeEach(() => {
    // clear the cache
    jest.resetModules();
    process.argv = ['--ipsum', 'lorem', '--hello', 'world', '--foo', 'bar'];
  });

  afterEach(() => {
    process.argv = ARGV;
  });

  it('should return the correct value of a command argument', () => {
    const expected = 'world';
    const actual = getArgument('hello');
    expect(actual).toEqual(expected);
  });

  it('should return undefined of a non-existent command argument', () => {
    const expected = undefined;
    const actual = getArgument('non-existent');
    expect(actual).toEqual(expected);
  });

  it('should return undefined of a non-existent value in a command', () => {
    process.argv.push('--without-a-value');
    const expected = undefined;
    const actual = getArgument('without-a-value');
    expect(actual).toEqual(expected);
  });
});

describe('convertOptionsFromArguments', () => {
  const ARGV = process.argv;

  beforeEach(() => {
    // clear the cache
    jest.resetModules();
    process.argv = ['--ipsum', 'lorem', '--hello', 'world', '--foo', 'bar'];
  });

  afterEach(() => {
    process.argv = ARGV;
  });

  it('should override options from arguments', () => {
    const expected = {
      ipsum: 'lorem',
      another: 'one',
      hello: 'world'
    };
    const actual = convertOptionsFromArguments({
      ipsum: 'foobar',
      another: 'one',
      hello: 'something'
    });
    expect(actual).toEqual(expected);
  });

  it('should preserve boolean default values when also not set as flag params', () => {
    const payload = {
      S3_DIRECTORY_SYNC_DERIVE_CONTENT_TYPE: false,
      S3_DIRECTORY_SYNC_PROGRESS: false
    };
    const actual = convertOptionsFromArguments(payload);
    expect(actual).toEqual(payload);
  });
});
