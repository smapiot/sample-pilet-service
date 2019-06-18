import { formatAuthor } from './author';

describe('Author Helpers', () => {
  it("returns the author's name if it is present", () => {
    const author = formatAuthor('User Example');
    expect(author.name).toBe('User Example');
    expect(author.email).toBeUndefined();
  });

  it("returns the author's email if it is present", () => {
    const author = formatAuthor('<user@example.com>');
    expect(author.email).toBe('user@example.com');
    expect(author.name).toBeUndefined();
  });

  it("returns the author's name and email if it is present", () => {
    const author = formatAuthor('User Example <user@example.com>');
    expect(author.name).toBe('User Example');
    expect(author.email).toBe('user@example.com');
  });

  it('returns a default value if not match was found', () => {
    const author = formatAuthor('', 'Foo');
    expect(author.name).toBe('Foo');
    expect(author.email).toBe('');
  });

  it("returns the author's name and email if it was passed", () => {
    const author = formatAuthor({ name: 'User example', email: 'user@example.com' });
    expect(author.name).toBe('User example');
    expect(author.email).toBe('user@example.com');
  });

  it("returns the author's name if it was passed", () => {
    const author = formatAuthor({ name: 'User example' });
    expect(author.name).toBe('User example');
    expect(author.email).toBeUndefined();
  });

  it("returns the author's email if it was passed", () => {
    const author = formatAuthor({ email: 'user@example.com' });
    expect(author.name).toBeUndefined();
    expect(author.email).toBe('user@example.com');
  });
});
