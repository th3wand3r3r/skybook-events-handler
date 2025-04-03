import { getEnvVar, getPort } from '../src'; // Replace `<filename>` with the actual file path if needed.

describe('Utility Functions', () => {
  describe('getEnvVar', () => {
    it('should return the value of an environment variable', () => {
      process.env.TEST_VAR = 'test-value';
      expect(getEnvVar('TEST_VAR')).toBe('test-value');
    });

    it('should return the default value if the environment variable is not set', () => {
      expect(getEnvVar('NON_EXISTENT_VAR', 'default')).toBe('default');
    });

    it('should throw an error if the environment variable is not set and no default value is provided', () => {
      expect(() => getEnvVar('NON_EXISTENT_VAR')).toThrow('Environment variable NON_EXISTENT_VAR is not set');
    });
  });

  describe('getPort', () => {
    it('should parse a valid port number', () => {
      expect(getPort('3000')).toBe(3000);
    });

    it('should throw an error if the port number is invalid', () => {
      expect(() => getPort('abc')).toThrow('Invalid PORT_NUMBER: abc');
      expect(() => getPort('99999')).toThrow('Invalid PORT_NUMBER: 99999');
    });
  });
});
