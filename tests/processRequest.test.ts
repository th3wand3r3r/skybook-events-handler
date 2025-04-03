import { Request, Response, NextFunction } from 'express';
import { processRequest } from '../src';
import validateData from '../src/validateData';
import saveData from '../src/saveData';

jest.mock('../src/validateData');
jest.mock('../src/saveData');

describe('processRequest', () => {
  const mockReq = {
    body: { url: 'https://example.com' },
  } as Request;

  const mockRes = {
    send: jest.fn(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate the data and save it successfully', async () => {
    (validateData as jest.Mock).mockReturnValue(true);
    (saveData as jest.Mock).mockResolvedValue(undefined);

    await processRequest(mockReq, mockRes, mockNext);

    expect(validateData).toHaveBeenCalledWith(mockReq.body);
    expect(saveData).toHaveBeenCalledWith(mockReq.body, expect.any(String));
    expect(mockRes.send).toHaveBeenCalledWith('Success');
  });

  it('should handle validation errors', async () => {
    (validateData as jest.Mock).mockReturnValue(false);

    await processRequest(mockReq, mockRes, mockNext);

    expect(validateData).toHaveBeenCalledWith(mockReq.body);
    expect(mockNext).toHaveBeenCalledWith(new Error('Data is not in the correct format'));
  });

  it('should handle save errors', async () => {
    (validateData as jest.Mock).mockReturnValue(true);
    (saveData as jest.Mock).mockRejectedValue(new Error('Save error'));

    await processRequest(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new Error('Save error'));
  });
});
