import { Request, Response, NextFunction } from "express";
const chalk = require("chalk");

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, path, query, body } = req;

  // Log request
  console.log(
    chalk.cyan("\n🔍 Incoming Request:"),
    chalk.yellow(`[${new Date().toISOString()}]`),
    chalk.green(`${method}`),
    chalk.blue(path),
    query && Object.keys(query).length ? chalk.gray(`Query: ${JSON.stringify(query)}`) : "",
    body && Object.keys(body).length ? chalk.gray(`Body: ${JSON.stringify(body)}`) : ""
  );

  // Capture response
  const originalSend = res.send;
  res.send = function (body) {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? chalk.red : chalk.green;
    
    // Log response
    console.log(
      chalk.cyan("📤 Outgoing Response:"),
      chalk.yellow(`[${new Date().toISOString()}]`),
      statusColor(`${res.statusCode}`),
      chalk.blue(path),
      chalk.gray(`${duration}ms`)
    );
    
    return originalSend.call(this, body);
  };

  next();
}; 