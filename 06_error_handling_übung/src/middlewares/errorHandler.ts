import type { ErrorRequestHandler } from 'express';
import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const errorLogger: ErrorRequestHandler = async (err, req, res, next) => {
  let errMessage = 'Internal server error';
  let statusCode = 500;

  if (err instanceof Error) {
    errMessage = err.message;
    if (err.cause && typeof err.cause === 'object' && 'status' in err.cause) {
      statusCode = err.cause.status as number;
    }
  }

  //
  // Uhrzeit, Datum, StatusCode, method, path , trace, Fehlermeldung
  //
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const logEntry = `${timestamp} | ${statusCode} | ${req.method} ${req.url} | ${errMessage}\n
  Stack: ${err.stack}\n\n`;

  try {
    const t = new Date().toISOString().split('T')[0];
    const dirPath = join(process.cwd(), 'log');

    await mkdir(dirPath, { recursive: true });

    const filePath = join(dirPath, `${t}.error.txt`);

    await appendFile(filePath, logEntry, 'utf-8');
  } catch (logError) {
    console.log(logError);
  }

  //
  res.status(statusCode).json({ error: errMessage });
};

export default errorLogger;
