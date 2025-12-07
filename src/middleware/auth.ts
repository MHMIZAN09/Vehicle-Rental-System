import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      // console.log({ AuthToken: authHeader });

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'You are not allowed!' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(
        token!,
        config.jwtSecret as string
      ) as JwtPayload;
      // console.log(decoded);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(403).json({ error: 'Forbidden: Unauthorized role' });
      }

      next();
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid token',
      });
    }
  };
};

export default auth;
