import validateData from '../src/validateData';

describe('validateData', () => {
  it('should return true for valid data with a non-empty url', () => {
    const data = { url: 'https://example.com' };
    expect(validateData(data)).toBe(true);
  });

  it('should return false for empty url strings', () => {
    const data = { url: '' };
    expect(validateData(data)).toBe(false);
  });

  it('should only validate object inputs', () => {
    const validInput = { key: 'value' };
    expect(validateData(validInput)).toBe(true);
  });

  it('should return false if `url` property is missing', () => {
    expect(validateData({})).toBe(false);
  });
});
