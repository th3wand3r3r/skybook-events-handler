import validateData from '../src/validateData';

describe('validateData', () => {
  it('should return true for valid data with a non-empty url', () => {
    const data = { url: 'https://example.com' };
    expect(validateData(data)).toBe(true);
  });

  it('should return false for empty url strings', () => {
    const data = null;
    expect(validateData(data as any)).toBe(false);
  });

  it('should only validate object inputs', () => {
    const validInput = { key: 'value' };
    expect(validateData(validInput)).toBe(true);
  });

});
