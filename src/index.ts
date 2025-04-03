import express, {Application, NextFunction, Request, Response} from 'express';
import validateData from './validateData';
import saveData from './saveData';

/**
 * Retrieves the value of the specified environment variable.
 *
 * @param {string} key - The name of the environment variable to retrieve.
 * @param {string} [defaultValue] - An optional default value to return if the variable is not set.
 * @returns {string} The value of the environment variable or the provided default value.
 * @throws {Error} If the environment variable is not set and no default value is provided.
 */
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value || defaultValue!;
};
/**
 * Parses a string to extract a valid port number.
 *
 * This function converts a given string into an integer value
 * representing a port number. It ensures the port number is within
 * the valid range of 1024 to 65535. An error is thrown if the
 * input string does not represent a valid port number or if the
 * number is out of the valid range.
 *
 * @param {string} portString - The string containing the port number to parse.
 * @returns {number} - The valid port number extracted from the input string.
 * @throws {Error} - Throws an error if the input string does not represent
 *                   a valid port number or if it is out of the valid range.
 */
export const getPort = (portString: string): number => {
  const port = parseInt(portString, 10);
  if (isNaN(port) || port < 1024 || port > 65535) {
    throw new Error(`Invalid PORT_NUMBER: ${portString}`);
  }
  return port;
};

/**
 * The port number on which the server will listen for incoming requests.
 *
 * This variable retrieves the port number from the environment variable `PORT_NUMBER`.
 * If the environment variable is not set, a default value of `3000` is used.
 *
 * The value is dynamically determined using the `getPort` utility function.
 * It ensures that the server is configured to use the correct port number.
 */
export const PORT: number = getPort(getEnvVar('PORT_NUMBER', '3000'));
/**
 * Represents the directory path where files or data are saved.
 * The value is determined by the environment variable 'DATA_LOCATION'.
 * If the environment variable is not defined, it defaults to './data'.
 *
 * This variable is useful for configuring the storage location of
 * application data, ensuring flexibility across different environments.
 */
export const SAVE_FOLDER: string = getEnvVar('DATA_LOCATION', './data');

/**
 * An object that defines the application routes as constant key-value pairs.
 * Each key represents a specific route name and its associated value represents the URL path.
 *
 * Properties:
 * - HOME: The root path of the application.
 * - HEALTHCHECK: Path for the health check endpoint, used to verify the application's status.
 * - PROCESS: Path for the process endpoint, responsible for handling specific operations.
 */
const ROUTES = {
  HOME: '/',
  HEALTHCHECK: '/healthcheck',
  PROCESS: '/process',
} as const;

/**
 * Logs a timestamped message to the console.
 *
 * The log function prepends the current date and time in ISO format
 * to the provided message before outputting it to the console.
 *
 * @param {string} message - The message to be logged.
 * @returns {void}
 */
const log = (message: string): void => console.log(`[${new Date().toISOString()}] ${message}`);

/**
 * Handles the processing of an incoming HTTP request.
 *
 * Validates the incoming request data, saves the data to a predefined folder,
 * and sends a success response to the client. If an error occurs during the
 * validation or saving process, the error is logged and passed to the next middleware.
 *
 * @param {Request<{}, {}>} req - The HTTP request object containing the request data.
 * @param {Response} res - The HTTP response object used to send a response to the client.
 * @param {NextFunction} next - The callback function to pass control to the next middleware.
 * @returns {Promise<void>} A promise that resolves when the request processing is complete.
 * @throws Will throw an error if the data is not in the correct format or if saving the data fails.
 */
export const processRequest = async (
  req: Request<{}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!validateData(req.body)) {
      throw new Error('Data is not in the correct format');
    }
    await saveData(req.body, SAVE_FOLDER);
    log(`Completed request and saved to file`);
    res.send('Success');
  } catch (error) {
    console.error(`[PROCESS ERROR] ${(error as Error).stack}`);
    next(error);
  }
};

/**
 * Represents an instance of an Express application.
 * The `app` variable provides access to the Express framework's features and functionality,
 * allowing the creation of web servers and APIs.
 * It is used to define middleware, routes, and configure the application's behavior.
 *
 * @type {Application}
 */
const app: Application = express();
app.use(express.json());

app.get(ROUTES.HOME, (_req, res) => {
  res.send({message: 'Running!'});
});

app.get(ROUTES.HEALTHCHECK, (_req, res) => {
  res.send({status: 'healthy', timestamp: new Date().toISOString()});
});
app.post(ROUTES.PROCESS, processRequest);

/**
 * Middleware function to handle errors occurring in the application.
 * Logs the error message and sends an appropriate HTTP response to the client
 * based on the error type.
 *
 * @param {Error} error - The error object caught during request processing.
 * @param {Request} _req - The HTTP request object (unused in this function).
 * @param {Response} res - The HTTP response object used to send error status and message.
 * @param {NextFunction} _next - The next middleware function (unused in this function).
 */
const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[ERROR] ${error.message}`);
  if (error.message === 'Data is not in the correct format') {
    res.status(400).send({ error: 'Invalid input data' });
  } else if (error.message === 'Failed to save data') {
    res.status(500).send({ error: 'Failed to save the provided data' });
  } else {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
app.use(errorHandler);

app.listen(PORT, () => log(`Server listening on port ${PORT}`));
