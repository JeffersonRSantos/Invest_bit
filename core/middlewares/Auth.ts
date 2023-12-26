import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { LogsProvider } from '../../src/repositories/implementations/LogsProvider';

const process: any = require('process')

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const Auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        (req as CustomRequest).token = decoded;

        (new LogsProvider(200, req.path, req.method, {type: 'IN', token: req.token, body: req.body}).saveLog())

        next();
    } catch (err) {
        res.status(401).json({ status: 401, error: "Essa rota requer autenticação." });
    }
};