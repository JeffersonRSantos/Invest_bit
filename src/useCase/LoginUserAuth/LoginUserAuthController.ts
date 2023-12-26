import { NextFunction, Request, Response } from 'express';
import { LoginUserAuthUseCase } from './LoginUserAuthUseCase';
import { loginAuthSchema } from '../../schemas/LoginAuthSchema'
import { LogsProvider } from '../../repositories/implementations/LogsProvider';
import { UserAuth } from '../../entities/UserAuth';

export class LoginUserAuthController {
    constructor(
        private loginUserAuthUseCase: LoginUserAuthUseCase
    ){}

    async login(req: Request, res: Response, next: NextFunction): Promise<Object>{        
    
        const validateSchema = await loginAuthSchema(req.body)

        if(!validateSchema.success){
            return res.status(401).json(validateSchema.error.issues);
        }

        try {            
            const loginUserAuthUseCase: UserAuth = await this.loginUserAuthUseCase.execute(req.body);
            new LogsProvider(200, req.path, req.method, {type: 'OUT', token: req.token, response: loginUserAuthUseCase}).saveLog()

            return res.status(loginUserAuthUseCase.status).json(loginUserAuthUseCase);
        } catch (error: any) {
            new LogsProvider(500, req.path, req.method, {type: 'OUT', token: req.token, error}).saveLog();     
            throw new Error(`${error}`);
            
        }

    }

}