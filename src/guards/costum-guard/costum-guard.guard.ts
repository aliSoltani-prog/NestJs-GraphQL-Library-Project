import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
  };
}

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    return {
      req: gqlContext.req,
      res: gqlContext.res,
    };
  }

async getTracker(req: AuthenticatedRequest): Promise<string> {
  const key = req.user?.id ?? req.ip
  return req.user?.id ?? req.ip ?? 'unknown';
  
}

    // Optional: log for debugging
    // console.log('Tracker key:', userId ?? ip ?? 'unknown');

    //return userId ?? ip ?? 'unknown';
  }
