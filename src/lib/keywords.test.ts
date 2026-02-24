import { extractKeywords } from './keywords';

describe('extractKeywords', () => {
  it('returns keywords from text', () => {
    const text = 'JavaScript is a programming language.';
    const result = extractKeywords(text);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});
