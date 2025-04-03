import fs from 'fs/promises';
import path from 'path';

/**
 * Asynchronously saves the provided data object to a JSON file in the specified folder with a timestamped filename.
 *
 * The function creates the folder if it does not already exist. The filename is generated using the current
 * date and time in the format `data-DD-MM-YY_HH-mm-ss-SSS.json`.
 *
 * If an error occurs during folder creation or file writing, an error is logged to the console and an exception is thrown.
 *
 * @param {object} data - The data object to be serialized and saved as a JSON file.
 * @param {string} folder - The directory path where the JSON file will be saved. If the folder does not exist, it will be created.
 * @returns {Promise<void>} A promise that resolves when the data has been successfully written to a file, or rejects if an error occurs.
 * @throws {Error} Throws an error if the data cannot be saved due to folder creation or file writing failures.
 */
const saveData = async (data: object, folder: string): Promise<void> => {
  try {
    await fs.mkdir(folder, { recursive: true });

    // Get current timestamp and format it as DD-MM-YY_HH-mm-ss-SSS
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB').replace(/\//g, '-'); // Format as DD-MM-YY
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // Format as HH-mm-ss
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0'); // Get zero-padded milliseconds
    const timestamp = `${formattedDate}_${time}-${milliseconds}`; // Combine date, time, and milliseconds

    const fileName = `data-${timestamp}.json`;
    const filePath = path.join(folder, fileName);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`[SAVE ERROR] Check folder "${folder}" or permissions.`);
    console.error(`[SAVE ERROR] ${(error as Error).message}`);
    throw new Error('Failed to save data');
  }
};

export default saveData;
