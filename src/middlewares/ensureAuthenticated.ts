import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/authConfig';
import AppError from '../errors/AppError';

interface TokenPayload {
  iat: string;
  exp: string;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  const decoded = verify(token, authConfig.jwt.secret);

  const { sub } = decoded as TokenPayload;

  request.user = {
    id: sub,
  };

  next();
}
