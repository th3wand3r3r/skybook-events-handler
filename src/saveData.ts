import fs from 'fs/promises';
import path from 'path';

/**
 * Asynchronously saves the provided data to a specified folder.
 *
 * The function ensures the target folder exists, creates a unique filename
 * if not provided via `data.fileData.fileName`, and writes the data as a JSON
 * file to the specified folder. Filenames are automatically generated based on
 * the current timestamp when a name is not explicitly given.
 *
 * @param {Object} data - The data object to be saved. Should include a property
 *                        `fileData.fileName` if a specific file name is desired.
 * @param {string} folder - The directory where the data will be saved. If the
 *                          folder does not exist, it will be created.
 * @returns {Promise<void>} A promise that resolves when the file is successfully
 *                          written or rejects if an error occurs.
 * @throws {Error} Throws an error if saving the data fails, for example,
 *                 due to file system permissions or invalid folder paths.
 */
const saveData = async (data: { [key: string]: any }, folder: string): Promise<void> => {
  try {
    await fs.mkdir(folder, {recursive: true});

    const fileName = data.fileData?.fileName && typeof data.fileData.fileName === 'string' && data.fileData.fileName.trim().length > 0
      ? data.fileData.fileName
      : (() => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-GB').replace(/\//g, '-'); // Format as DD-MM-YY
        const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // Format as HH-mm-ss
        const milliseconds = now.getMilliseconds().toString().padStart(3, '0'); // Get zero-padded milliseconds
        return `data-${formattedDate}_${time}-${milliseconds}.json`;
      })();

    const filePath = path.join(folder, fileName);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`[SAVE ERROR] Check folder "${folder}" or permissions.`);
    console.error(`[SAVE ERROR] ${(error as Error).message}`);
    throw new Error('Failed to save data');
  }
};

export default saveData;
