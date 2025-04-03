import saveData from '../src/saveData';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('saveData', () => {
  const mockData = { key: 'value' };
  const mockFolder = './mock-folder';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save data to a file in the specified folder', async () => {
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

    await saveData(mockData, mockFolder);

    expect(fs.mkdir).toHaveBeenCalledWith(mockFolder, { recursive: true });
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining(mockFolder),
      JSON.stringify(mockData, null, 2),
      'utf8'
    );
  });

  it('should throw an error if saving fails', async () => {
    (fs.mkdir as jest.Mock).mockRejectedValue(new Error('mkdir failed'));

    await expect(saveData(mockData, mockFolder)).rejects.toThrow('Failed to save data');

    expect(fs.mkdir).toHaveBeenCalledWith(mockFolder, { recursive: true });
  });
});
