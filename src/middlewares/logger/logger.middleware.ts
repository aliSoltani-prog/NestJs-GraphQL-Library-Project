// src/common/middleware/logger.middleware.ts
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, body } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;

      if (originalUrl.includes('graphql')) {
        const splittedQuery = body?.query?.split(' ');
        const operationType = splittedQuery[0];
        const operationName = splittedQuery[1];

        // Skip introspection queries
        if (operationName !== 'IntrospectionQuery') {
          // Determine the arguments
          let args = '{}';

          try {
            // 1️⃣ Use variables if provided
            if (body?.variables && Object.keys(body.variables).length > 0) {
              args = JSON.stringify(body.variables, null, 2);
            } else if (body?.query) {
              // 2️⃣ Try to parse inline arguments from the query
              // Regex to extract arguments inside parentheses
              const match = body.query.match(/\(([\s\S]*?)\)/);
              if (match && match[1]) {
                args = match[1]
                  .replace(/\s+/g, ' ') // clean extra whitespace
                  .trim();
              }
            }
          } catch (err) {
            args = '{}';
          }

          this.logger.log(
            `[GraphQL] ${operationType} ${operationName} -> ${statusCode} - ${duration}ms\nArguments: ${args}`
          );
        }
      } else {
        // REST fallback
        this.logger.log(
          `[REST] ${method} ${originalUrl} -> ${statusCode} - ${duration}ms`
        );
      }
    });

    //console.log("body", body)
    next();
  }
}
